"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { ToastItem } from "./ToastItem";
import { addToast, dismissToast, EMPTY_QUEUE } from "./toast-queue";

type ShowToast = (ok: boolean, message: string) => void;

const ToastContext = createContext<ShowToast | null>(null);

/** Mounted once in the admin layout; renders the fixed top-right toast region. */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [queue, setQueue] = useState(EMPTY_QUEUE);
  const show = useCallback<ShowToast>((ok, message) => setQueue((q) => addToast(q, ok, message)), []);
  const close = useCallback((id: number) => setQueue((q) => dismissToast(q, id)), []);
  const value = useMemo(() => show, [show]);
  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed right-4 top-4 z-50 flex w-80 max-w-[calc(100vw-2rem)] flex-col gap-2"
      >
        {queue.items.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <ToastItem toast={toast} onClose={close} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useShowToast(): ShowToast {
  const show = useContext(ToastContext);
  if (show === null) throw new Error("useShowToast needs a ToastProvider");
  return show;
}
