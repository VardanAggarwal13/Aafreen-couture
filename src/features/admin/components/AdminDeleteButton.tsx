'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  /** DELETE endpoint, e.g. /api/admin/orders/123 */
  endpoint: string;
  /** Used in the confirmation text, e.g. "order #AFR-1001" */
  label: string;
  /** If set, the admin must type this exact text to confirm (for risky deletes). */
  typeToConfirm?: string;
  /** Extra JSON body sent with the DELETE (only after the admin confirmed). */
  body?: Record<string, unknown>;
  /** Where to go after deleting; defaults to refreshing the current page. */
  redirectTo?: string;
  /** Show a text button instead of an icon. */
  variant?: 'icon' | 'text';
}

/** One consistent, confirmed delete action for admin lists and detail pages. */
export function AdminDeleteButton({ endpoint, label, typeToConfirm, body, redirectTo, variant = 'icon' }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function handleDelete() {
    if (typeToConfirm) {
      const typed = window.prompt(`This permanently deletes ${label} and cannot be undone.\n\nType ${typeToConfirm} to confirm:`);
      if (typed === null) return;
      if (typed.trim() !== typeToConfirm) {
        toast.error('That did not match, so nothing was deleted');
        return;
      }
    } else if (!window.confirm(`Permanently delete ${label}? This cannot be undone.`)) {
      return;
    }

    setBusy(true);
    try {
      const res = await fetch(endpoint, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body ?? {}),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error ?? 'Failed to delete');
      toast.success(json.message ?? 'Deleted');
      if (redirectTo) router.push(redirectTo);
      router.refresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete');
    } finally {
      setBusy(false);
    }
  }

  if (variant === 'text') {
    return (
      <button
        onClick={handleDelete}
        disabled={busy}
        className="inline-flex items-center gap-1.5 border border-[#DDD2C5] text-[#8A6A55] hover:border-red-400 hover:text-red-600 text-xs font-semibold uppercase tracking-wider px-3 py-2 rounded-lg disabled:opacity-50 cursor-pointer"
      >
        <Trash2 size="0.8125rem" /> {busy ? 'Deleting…' : 'Delete'}
      </button>
    );
  }

  return (
    <button
      onClick={handleDelete}
      disabled={busy}
      title={`Delete ${label}`}
      aria-label={`Delete ${label}`}
      className="p-1.5 text-[#8A6A55]/60 hover:text-red-600 transition-colors disabled:opacity-50 cursor-pointer"
    >
      <Trash2 size="0.875rem" />
    </button>
  );
}
