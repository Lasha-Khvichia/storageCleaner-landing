/** Pure toast queue: newest first, at most MAX_TOASTS visible. */
export const MAX_TOASTS = 3;

export interface Toast {
  id: number;
  ok: boolean;
  message: string;
}

export interface ToastQueue {
  items: Toast[];
  nextId: number;
}

export const EMPTY_QUEUE: ToastQueue = { items: [], nextId: 1 };

export function addToast(queue: ToastQueue, ok: boolean, message: string): ToastQueue {
  const toast: Toast = { id: queue.nextId, ok, message };
  return { items: [toast, ...queue.items].slice(0, MAX_TOASTS), nextId: queue.nextId + 1 };
}

export function dismissToast(queue: ToastQueue, id: number): ToastQueue {
  return { ...queue, items: queue.items.filter((toast) => toast.id !== id) };
}
