"use client";

import { useActionState, useState } from "react";
import { changeReleaseAction } from "@/admin/actions";
import { BUTTON, BUTTON_DANGER } from "./button-style";

interface Props {
  id: number;
  version: string;
  hidden: boolean;
  removed: boolean;
}

/** Hide/Show and Remove/Restore for one release; Remove asks for a confirmation first. */
export function ReleaseButtons({ id, version, hidden, removed }: Props) {
  const [state, run, pending] = useActionState(changeReleaseAction, null);
  const [confirming, setConfirming] = useState(false);
  const submit = (change: string, label: string, style = BUTTON) => (
    <button
      type="submit"
      name="change"
      value={change}
      disabled={pending}
      className={style}
      aria-label={`${label} version ${version}`}
    >
      {label}
    </button>
  );
  return (
    <form action={run} onSubmit={() => setConfirming(false)} className="flex flex-wrap items-center gap-2">
      <input type="hidden" name="id" value={id} />
      {removed ? (
        submit("restore", "Restore")
      ) : (
        <>
          {submit(hidden ? "show" : "hide", hidden ? "Show" : "Hide")}
          {confirming ? (
            <>
              {submit("remove", "Confirm remove", BUTTON_DANGER)}
              <button type="button" className={BUTTON} onClick={() => setConfirming(false)}>
                Cancel
              </button>
            </>
          ) : (
            <button type="button" className={BUTTON_DANGER} onClick={() => setConfirming(true)}>
              Remove
            </button>
          )}
        </>
      )}
      {state && (
        <span role="status" className={state.ok ? "text-sm text-positive-300" : "text-sm text-review"}>
          {state.message}
        </span>
      )}
    </form>
  );
}
