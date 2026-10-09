'use client';

import { useEffect, useRef } from 'react';

export default function Modal({ open, onClose, title, children }: {
  open: boolean; onClose: () => void; title: string; children: React.ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => { if (e.target === ref.current) onClose(); }}
      aria-label={title}
      className="m-auto w-[min(1100px,calc(100vw-32px))] max-h-[calc(100vh-48px)] rounded-xl shadow-xl p-0 backdrop:bg-black/50"
      style={{ background: 'var(--color-bg)' }}
    >
      <div
        className="sticky top-0 z-10 flex items-center justify-between gap-4 px-6 py-4 border-b bg-white"
        style={{ borderColor: 'var(--color-border)' }}
      >
        <h2 className="text-lg font-bold" style={{ color: 'var(--color-text)' }}>{title}</h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Stäng"
          className="w-8 h-8 flex items-center justify-center rounded-full text-xl leading-none cursor-pointer hover:bg-[var(--color-kpi-bg)]"
          style={{ color: 'var(--color-text-muted)' }}
        >
          ×
        </button>
      </div>
      <div className="px-6 py-5">{children}</div>
    </dialog>
  );
}
