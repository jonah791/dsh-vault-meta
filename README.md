# dsh-vault-meta

凭据库只读元数据工具：列出 vault 条目与字段名（**只碰非密元数据**，绝不读取或回显任何明文/密文）——把「我有什么凭据」变成一条工具调用，不再手打 PowerShell

## 工具
- `vault_list`：列出凭据库条目（site / username / 有哪些字段 / 更新时间）——**非密元数据**，用于查「我注册过哪些站点、有哪些字段」，不返回任何口令或私钥。
- `vault_fields`：查某条目的字段清单（只看**字段名**，不看值）——用于确认某站点存了哪些字段（password/recovery/notes 等）。

## 构建与挂载

```sh
pnpm build
# 挂载到 web profile（dsh plugin-manager 或 plugin_mount）
```

组合行 id：`agent-vault-meta`
