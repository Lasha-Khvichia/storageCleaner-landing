# src/app/admin: the private admin

Lets one person (GitHub user id `189664952`) hide, show, remove and restore versions, run the GitHub sync and
read the audit log. Logic lives in `src/admin/`; this folder is pages, routes and small components.

## Where to start reading

`page.tsx` (the page) > `_components/` > `src/admin/actions.ts` (every write) > `src/admin/action-guard.ts`.

## Who can reach what

| Route | Who |
|---|---|
| `/admin` | Not configured: a notice only. No session: redirect to `/admin/login`. Valid session of the allowed id: the page. |
| `/admin/login` | Anyone; it only starts the GitHub sign-in. |
| `/admin/callback` | Anyone arriving from GitHub with a valid `state`; only GitHub id `ADMIN_GITHUB_USER_ID` gets a session, everyone else sees "Not allowed" and no cookie. |
| Server Actions (change, sync, logout) | Same Origin and Host as `SITE_URL` and a valid session. |

The backend re-checks the GitHub token itself (403 for any other user).

## Login flow

1. `/admin/login` creates a random `state` and PKCE verifier, stores them in the `__Host-sc_oauth` cookie
   (HttpOnly, Secure, SameSite=Lax, Path=/, 10 minutes) and redirects to GitHub (code flow, S256 challenge, no scopes).
2. GitHub sends the user to `/admin/callback?code&state`.
3. The callback compares `state` with the cookie in constant time, deletes the cookie (one use), exchanges the
   code on the server with the client secret and verifier, and calls `GET https://api.github.com/user`.
4. If the numeric id is not `ADMIN_GITHUB_USER_ID`: plain "Not allowed", no session.
5. Otherwise the session (id, login, GitHub token) is encrypted with `jose` (`dir`, `A256GCM`, first key of
   `ADMIN_SESSION_KEY`) into `__Host-sc_admin` (HttpOnly, Secure, SameSite=Lax, 8 hours), then redirect to `/admin`.

Logout is a Server Action that expires the cookie.

## Page and actions

The page calls the backend (`/api/v1/admin/...`) with `Authorization: Bearer ADMIN_SERVICE_KEY` and
`X-GitHub-Token`, validates every answer (`src/admin/admin-guard.ts`) and shows a message per error status.
Buttons are real `<button>`s with version-specific labels. Remove opens a small centered confirm dialog
(`RemoveDialog.tsx`, native `<dialog>` with `showModal()`: Esc and Cancel close it, Cancel is focused first; its
Remove button submits the same form with `change=remove`).

Every action result (success or error) is a toast, top right: `ToastProvider` is mounted once in `layout.tsx`,
and each action component calls `useActionToast(state)`, which shows one toast per new result. Success hides
after 4 s (`role="status"`); an error stays until closed (`role="alert"`); at most 3 are shown, newest on top
(`toast-queue.ts`, unit-tested). Nothing is rendered inside table rows, so the table never shifts. Page-load
errors (`ErrorNote`) are not toasts. `layout.tsx` sets `noindex, nofollow`; `robots.txt` also disallows `/admin`.

## Env vars (server-only)

`GITHUB_OAUTH_CLIENT_ID`, `GITHUB_OAUTH_CLIENT_SECRET`, `ADMIN_SESSION_KEY`, `ADMIN_GITHUB_USER_ID`,
`ADMIN_SERVICE_KEY`, `RELEASES_API_URL`. Any missing or invalid: "Admin is not configured".
