/**
 * dsh-vault-meta：凭据库只读元数据工具：列出 vault 条目与字段名（**只碰非密元数据**，绝不读取或回显任何明文/密文）——把「我有什么凭据」变成一条工具调用，不再手打 PowerShell
 */
import type { Context } from '@deepseek-ai/cordis'
import z from '@deepseek-ai/schemastery'
import { defineTool } from '@deepseek-ai/dsh-tools'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'

export const name = "agent-vault-meta"
export const inject = ["tools"] as const

export interface Config {
  enabled: boolean
}
export const Config = z.object({
  enabled: z.boolean().default(true),
})

export function apply(ctx: Context, config: Config): void {
  const logger = ctx.logger("agent-vault-meta")

    ctx.tools.register(defineTool({
      name: "vault_list",
      description: "列出凭据库条目（site / username / 有哪些字段 / 更新时间）——**非密元数据**，用于查「我注册过哪些站点、有哪些字段」，不返回任何口令或私钥。",
      parameters: {},
      output: {
        schema: {"type":"object","additionalProperties":false,"properties":{"ok":{"type":"boolean","required":true},"text":{"type":"string"}}},
        render: (_a: unknown, v: any) => [{ type: 'text', text: JSON.stringify(v) }],
      },
      async execute(args: Record<string, unknown>) {
        const __raw = await (async () => {
          const run = promisify(execFile);
          const script = 'E:\\alice\\projects\\self\\alice-identity\\scripts\\vault.ps1';
          const { stdout, stderr } = await run('powershell.exe', ['-NoProfile','-ExecutionPolicy','Bypass','-File', script, 'list'], { timeout: 60000, windowsHide: true });
          return (stdout + stderr).trim();
        })()
        if (__raw && typeof __raw === 'object' && 'ok' in (__raw as any)) return __raw as any
        return { ok: true, text: typeof __raw === 'string' ? __raw : JSON.stringify(__raw) } as any
      },
    }))

    ctx.tools.register(defineTool({
      name: "vault_fields",
      description: "查某条目的字段清单（只看**字段名**，不看值）——用于确认某站点存了哪些字段（password/recovery/notes 等）。",
      parameters: {"site":{"description":"条目 site 名（如 nearai-market）","required":true,"type":"string"}},
      output: {
        schema: {"type":"object","additionalProperties":false,"properties":{"ok":{"type":"boolean","required":true},"text":{"type":"string"}}},
        render: (_a: unknown, v: any) => [{ type: 'text', text: JSON.stringify(v) }],
      },
      async execute(args: {
  site: string
}) {
        const { site } = args as any
        const __raw = await (async () => {
          const run = promisify(execFile);
          const script = 'E:\\alice\\projects\\self\\alice-identity\\scripts\\vault.ps1';
          const { stdout, stderr } = await run('powershell.exe', ['-NoProfile','-ExecutionPolicy','Bypass','-File', script, 'get', '-Site', String(site), '-Field', 'fields'], { timeout: 60000, windowsHide: true });
          return (stdout + stderr).trim();
        })()
        if (__raw && typeof __raw === 'object' && 'ok' in (__raw as any)) return __raw as any
        return { ok: true, text: typeof __raw === 'string' ? __raw : JSON.stringify(__raw) } as any
      },
    }))
}
