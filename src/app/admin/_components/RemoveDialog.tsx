"use client";

import { useRef } from "react";
import { BUTTON, BUTTON_DANGER } from "./button-style";

interface Props {
  version: string;
  disabled: boolean;
}

/** The Remove button plus its centered confirm dialog; must sit inside the release form. */
export function RemoveDialog({ version, disabled }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  return (
    <>
      <button
        type="button"
        disabled={disabled}
        className={BUTTON_DANGER}
        aria-label={`Remove version ${version}`}
        onClick={() => dialog.current?.showModal()}
      >
        Remove
      </button>
      <dialog
        ref={dialog}
        aria-labelledby={`remove-title-${version}`}
        className="m-auto w-80 max-w-[calc(100vw-2rem)] rounded-card border border-line bg-surface p-5 text-fg backdrop:bg-overlay"
      >
        <h2 id={`remove-title-${version}`} className="text-base font-semibold">
          Remove version {version}?
        </h2>
        <p className="mt-2 text-sm text-muted">
          Visitors can no longer download it. You can restore it later.
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <button type="button" autoFocus className={BUTTON} onClick={() => dialog.current?.close()}>
            Cancel
          </button>
          <button
            type="submit"
            name="change"
            value="remove"
            className={BUTTON_DANGER}
            onClick={() => dialog.current?.close()}
          >
            Remove
          </button>
        </div>
      </dialog>
    </>
  );
}
