# src/admin: admin logic (server-side only)

Nothing here runs in the browser. Pages are in `src/app/admin/` (see its README for the flows and who can reach
what). Files that tests load use `.ts` imports and avoid `next/*`.

| File | Job |
|---|---|
| `config.ts`, `session-keys.ts` | Read and validate the admin env vars; null = "not configured". |
| `pkce.ts`, `oauth-flow.ts`, `oauth-cookie.ts`, `github-api.ts` | Sign-in: state, PKCE S256, authorize URL, allowlist by id, the two GitHub calls. |
| `session.ts` | Encrypted session (`jose`), 8 hours, key rotation. |
| `cookie-options.ts`, `current-admin.ts` | Cookie names/flags; who is asking (reads cookies). |
| `origin.ts`, `action-guard.ts`, `actions.ts` | Origin/Host check, the guard every Server Action starts with, the actions. |
| `api-client.ts`, `admin-api.ts`, `admin-guard.ts`, `types.ts` | Backend calls, error messages (no credentials), runtime validation, types. |
| `format-time.ts` | Fixed UTC time text. |
