"use client";

import { useActionState } from "react";
import { changeReleaseAction } from "@/admin/actions";
import { BUTTON } from "./button-style";
import { RemoveDialog } from "./RemoveDialog";
import { useActionToast } from "./useActionToast";

interface Props {
  id: number;
  version: string;
  hidden: boolean;
  removed: boolean;
}

/** Hide/Show and Remove/Restore for one release; results appear as toasts. */
export function ReleaseButtons({ id, version, hidden, removed }: Props) {
  const [state, run, pending] = useActionState(changeReleaseAction, null);
  useActionToast(state);
  const submit = (change: string, label: string) => (
    <button
      type="submit"
      name="change"
      value={change}
      disabled={pending}
      className={BUTTON}
      aria-label={`${label} version ${version}`}
    >
      {label}
    </button>
  );
  return (
    <form action={run} className="flex flex-wrap items-center gap-2">
      <input type="hidden" name="id" value={id} />
      {removed ? (
        submit("restore", "Restore")
      ) : (
        <>
          {submit(hidden ? "show" : "hide", hidden ? "Show" : "Hide")}
          <RemoveDialog version={version} disabled={pending} />
        </>
      )}
    </form>
  );
}
