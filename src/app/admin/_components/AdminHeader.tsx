import { logoutAction } from "@/admin/actions";
import { BUTTON } from "./button-style";

export function AdminHeader({ login }: { login: string }) {
  return (
    <header className="mb-8 flex flex-wrap items-center justify-between gap-3">
      <h1 className="text-2xl font-semibold">Versions</h1>
      <div className="flex items-center gap-3 text-sm">
        <span className="text-muted">
          Signed in as <strong className="text-fg">{login}</strong>
        </span>
        <form action={logoutAction}>
          <button type="submit" className={BUTTON}>
            Log out
          </button>
        </form>
      </div>
    </header>
  );
}
