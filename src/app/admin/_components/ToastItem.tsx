"use client";

import { useEffect } from "react";
import type { Toast } from "./toast-queue";

const AUTO_HIDE_MS = 4000;

interface Props {
  toast: Toast;
  onClose: (id: number) => void;
}

/** One toast. Success hides itself after 4 s; an error stays until closed. */
export function ToastItem({ toast, onClose }: Props) {
  const { id, ok, message } = toast;
  useEffect(() => {
    if (!ok) return;
    const timer = setTimeout(() => onClose(id), AUTO_HIDE_MS);
    return () => clearTimeout(timer);
  }, [id, ok, onClose]);
  const tone = ok ? "border-positive-300 text-positive-300" : "border-review text-review";
  return (
    <div
      role={ok ? "status" : "alert"}
      className={`flex items-start gap-3 rounded-card border bg-surface px-4 py-3 text-sm shadow-lg ${tone}`}
    >
      <p className="min-w-0 flex-1 break-words">{message}</p>
      <button
        type="button"
        aria-label="Close notification"
        onClick={() => onClose(id)}
        className="shrink-0 leading-none text-muted hover:text-fg focus-visible:outline-2 focus-visible:outline-accent-400"
      >
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  );
}
