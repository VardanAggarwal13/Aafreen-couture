'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ImagePlus, RotateCcw, ExternalLink, Loader2, Eye, Pencil, X, Crosshair } from 'lucide-react';
import { toast } from 'sonner';
import { uploadImage } from '@/features/admin/lib/cloudinary-upload';

export interface HeroImageItem {
  key: string;
  label: string;
  path: string;
  hint: string;
  defaultImage: string;
  defaultFocal: { x: number; y: number };
  image: string;
  focal: { x: number; y: number };
  isCustom: boolean;
}

const clamp = (n: number) => Math.min(100, Math.max(0, Math.round(n)));
const pos = (f: { x: number; y: number }) => `${f.x}% ${f.y}%`;

/** Same crop the live page uses: wide frame on desktop, shorter frame on phones. */
function CropPreview({ src, alt, focal, className }: { src: string; alt: string; focal: { x: number; y: number }; className: string }) {
  return (
    <div className={`relative overflow-hidden rounded-xl bg-[#EAE2D7] ${className}`}>
      <Image src={src} alt={alt} fill sizes="(max-width: 48em) 90vw, 34rem" className="object-cover" style={{ objectPosition: pos(focal) }} />
    </div>
  );
}

function Modal({ title, onClose, busy, children }: { title: string; onClose: () => void; busy?: boolean; children: ReactNode }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !busy) onClose();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose, busy]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-black/45 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !busy) onClose();
      }}
    >
      <div role="dialog" aria-modal="true" aria-label={title} className="bg-white rounded-2xl shadow-xl w-full max-w-4xl relative my-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#EAE2D7]">
          <h2 className="text-base font-sans font-semibold text-[#2E221C]">{title}</h2>
          <button onClick={onClose} disabled={busy} className="text-[#8A6A55] hover:text-[#2E221C] disabled:opacity-40 cursor-pointer" aria-label="Close">
            <X size="1.125rem" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function AdminHeroImagesClient({ initialItems }: { initialItems: HeroImageItem[] }) {
  const [items, setItems] = useState<HeroImageItem[]>(initialItems);
  const [viewKey, setViewKey] = useState<string | null>(null);
  const [editKey, setEditKey] = useState<string | null>(null);

  const viewing = items.find((i) => i.key === viewKey) ?? null;
  const editing = items.find((i) => i.key === editKey) ?? null;

  function applySaved(key: string, patch: Partial<HeroImageItem>) {
    setItems((prev) => prev.map((i) => (i.key === key ? { ...i, ...patch } : i)));
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-serif text-[#2E221C] tracking-tight">Page Hero Images</h1>
        <p className="text-xs text-[#8A6A55] mt-1 font-sans">
          The large photo at the top of each main menu page. View how it looks on desktop and phone, or edit it. Changes go live within a couple of minutes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {items.map((item) => (
          <div key={item.key} className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col">
            <button onClick={() => setViewKey(item.key)} className="relative block aspect-[34/25] bg-[#EAE2D7] cursor-zoom-in group" aria-label={`View the ${item.label} hero image`}>
              <Image
                src={item.image}
                alt={`${item.label} page hero image`}
                fill
                sizes="(max-width: 48em) 100vw, (max-width: 80em) 50vw, 33vw"
                className="object-cover"
                style={{ objectPosition: pos(item.focal) }}
              />
              <span className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors" />
              <span
                className={`absolute top-3 left-3 text-[0.625rem] font-semibold uppercase tracking-wider px-2 py-1 rounded-full ${
                  item.isCustom ? 'bg-[#C9A86A] text-white' : 'bg-white/90 text-[#8A6A55]'
                }`}
              >
                {item.isCustom ? 'Edited' : 'Original'}
              </span>
            </button>

            <div className="p-4 flex-1 flex flex-col gap-3 font-sans">
              <div>
                <h2 className="text-sm font-semibold text-[#2E221C]">{item.label}</h2>
                <p className="text-xs text-[#8A6A55] mt-0.5">{item.hint}</p>
              </div>
              <div className="mt-auto flex items-center gap-2">
                <button
                  onClick={() => setViewKey(item.key)}
                  className="inline-flex items-center gap-1.5 border border-[#DDD2C5] text-[#2E221C] hover:border-[#C9A86A] text-xs font-semibold uppercase tracking-wider px-3 py-2 rounded-lg cursor-pointer"
                >
                  <Eye size="0.875rem" /> View
                </button>
                <button
                  onClick={() => setEditKey(item.key)}
                  className="inline-flex items-center gap-1.5 bg-[#C9A86A] hover:bg-[#B58E52] text-white text-xs font-semibold uppercase tracking-wider px-3 py-2 rounded-lg cursor-pointer"
                >
                  <Pencil size="0.8125rem" /> Edit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {viewing && (
        <Modal title={`${viewing.label} hero image`} onClose={() => setViewKey(null)}>
          <div className="p-5 grid grid-cols-1 lg:grid-cols-[1fr_16rem] gap-6 font-sans">
            <div className="space-y-5">
              <div>
                <p className="text-[0.625rem] font-semibold uppercase tracking-wider text-[#8A6A55] mb-2">On desktop</p>
                <CropPreview src={viewing.image} alt={`${viewing.label} on desktop`} focal={viewing.focal} className="aspect-[34/25] w-full max-w-[34rem]" />
              </div>
              <div>
                <p className="text-[0.625rem] font-semibold uppercase tracking-wider text-[#8A6A55] mb-2">On phone and tablet</p>
                <CropPreview src={viewing.image} alt={`${viewing.label} on phone`} focal={viewing.focal} className="aspect-[4/3] w-full max-w-[22rem]" />
              </div>
            </div>
            <div className="space-y-3 text-xs text-[#8A6A55]">
              <div>
                <p className="font-semibold text-[#2E221C] text-sm">{viewing.label}</p>
                <p className="mt-0.5">{viewing.hint}</p>
              </div>
              <p>
                <span className="font-semibold text-[#2E221C]">Status: </span>
                {viewing.isCustom ? 'Edited by you' : 'Original image'}
              </p>
              <p>
                <span className="font-semibold text-[#2E221C]">Focus point: </span>
                {viewing.focal.x}% across, {viewing.focal.y}% down
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  onClick={() => {
                    setViewKey(null);
                    setEditKey(viewing.key);
                  }}
                  className="inline-flex items-center gap-1.5 bg-[#C9A86A] hover:bg-[#B58E52] text-white text-xs font-semibold uppercase tracking-wider px-3 py-2 rounded-lg cursor-pointer"
                >
                  <Pencil size="0.8125rem" /> Edit
                </button>
                <Link
                  href={viewing.path}
                  target="_blank"
                  className="inline-flex items-center gap-1.5 border border-[#DDD2C5] text-[#2E221C] text-xs font-semibold uppercase tracking-wider px-3 py-2 rounded-lg"
                >
                  <ExternalLink size="0.8125rem" /> Open page
                </Link>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {editing && (
        <EditDialog
          key={editing.key}
          item={editing}
          onClose={() => setEditKey(null)}
          onSaved={(patch) => {
            applySaved(editing.key, patch);
            setEditKey(null);
          }}
        />
      )}
    </div>
  );
}

function EditDialog({
  item,
  onClose,
  onSaved,
}: {
  item: HeroImageItem;
  onClose: () => void;
  onSaved: (patch: Partial<HeroImageItem>) => void;
}) {
  const [image, setImage] = useState(item.image);
  const [focal, setFocal] = useState(item.focal);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const busy = uploading || saving;
  const changed = image !== item.image || focal.x !== item.focal.x || focal.y !== item.focal.y;

  async function handleFile(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please choose an image file (JPG, PNG or WebP)');
      return;
    }
    setUploading(true);
    try {
      setImage(await uploadImage(file));
      setFocal({ x: 50, y: 50 });
      toast.success('Photo uploaded. Choose the focus point, then save.');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to upload the image');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  function pickFocal(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    setFocal({ x: clamp(((e.clientX - rect.left) / rect.width) * 100), y: clamp(((e.clientY - rect.top) / rect.height) * 100) });
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/hero-images', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: item.key, image, focalX: focal.x, focalY: focal.y }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Failed to save');
      toast.success(`${item.label} hero image saved`);
      onSaved({ image, focal, isCustom: true });
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  }

  async function handleUseOriginal() {
    if (!confirm(`Go back to the original ${item.label} hero image?`)) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/hero-images', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: item.key }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Failed to reset');
      toast.success(`${item.label} hero image reset`);
      onSaved({ image: item.defaultImage, focal: item.defaultFocal, isCustom: false });
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to reset');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal title={`Edit ${item.label} hero image`} onClose={onClose} busy={busy}>
      <div className="p-5 grid grid-cols-1 lg:grid-cols-2 gap-6 font-sans">
        {/* Left: full photo + focus picker */}
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[0.625rem] font-semibold uppercase tracking-wider text-[#8A6A55]">Click the photo to set the focus point</p>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
            <button
              onClick={() => fileRef.current?.click()}
              disabled={busy}
              className="inline-flex items-center gap-1.5 border border-[#C9A86A] text-[#9E7B3A] hover:bg-[#C9A86A] hover:text-white text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded-lg disabled:opacity-60 cursor-pointer shrink-0"
            >
              <ImagePlus size="0.875rem" /> {uploading ? 'Uploading…' : 'Replace photo'}
            </button>
          </div>

          <div className="relative rounded-xl overflow-hidden bg-[#EAE2D7] cursor-crosshair select-none" onClick={pickFocal}>
            <Image
              src={image}
              alt={`${item.label} full photo`}
              width={0}
              height={0}
              sizes="(max-width: 64em) 90vw, 28rem"
              style={{ width: '100%', height: 'auto', maxHeight: '28rem', objectFit: 'contain' }}
              draggable={false}
            />
            <span
              className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center w-8 h-8 rounded-full bg-white/80 ring-2 ring-[#C9A86A] shadow"
              style={{ left: `${focal.x}%`, top: `${focal.y}%` }}
            >
              <Crosshair size="1rem" className="text-[#9E7B3A]" />
            </span>
            {uploading && (
              <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                <Loader2 className="animate-spin text-[#9E7B3A]" size="1.5rem" />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs text-[#8A6A55]">
            <label className="space-y-1">
              <span className="flex justify-between"><span>Left ↔ Right</span><span className="tabular-nums">{focal.x}%</span></span>
              <input type="range" min={0} max={100} value={focal.x} onChange={(e) => setFocal({ ...focal, x: Number(e.target.value) })} className="w-full accent-[#C9A86A]" />
            </label>
            <label className="space-y-1">
              <span className="flex justify-between"><span>Top ↕ Bottom</span><span className="tabular-nums">{focal.y}%</span></span>
              <input type="range" min={0} max={100} value={focal.y} onChange={(e) => setFocal({ ...focal, y: Number(e.target.value) })} className="w-full accent-[#C9A86A]" />
            </label>
          </div>
        </div>

        {/* Right: live result */}
        <div className="space-y-4">
          <div>
            <p className="text-[0.625rem] font-semibold uppercase tracking-wider text-[#8A6A55] mb-2">How it will look on desktop</p>
            <CropPreview src={image} alt="Desktop preview" focal={focal} className="aspect-[34/25] w-full" />
          </div>
          <div>
            <p className="text-[0.625rem] font-semibold uppercase tracking-wider text-[#8A6A55] mb-2">How it will look on phone</p>
            <CropPreview src={image} alt="Phone preview" focal={focal} className="aspect-[4/3] w-full max-w-[18rem]" />
          </div>
          <p className="text-[0.6875rem] text-[#8A6A55]">
            The page crops the photo to fit. The focus point is the part that always stays in view. Use a landscape photo at least 1600 px wide.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-t border-[#EAE2D7] bg-[#FAF7F2] rounded-b-2xl">
        {item.isCustom ? (
          <button onClick={handleUseOriginal} disabled={busy} className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#8A6A55] hover:text-red-600 disabled:opacity-60 cursor-pointer">
            <RotateCcw size="0.8125rem" /> Use original
          </button>
        ) : (
          <span />
        )}
        <div className="flex items-center gap-2">
          <button onClick={onClose} disabled={busy} className="px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg border border-[#DDD2C5] text-[#8A6A55] hover:text-[#2E221C] disabled:opacity-60 cursor-pointer">
            Cancel
          </button>
          <button onClick={handleSave} disabled={busy || !changed} className="px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg bg-[#C9A86A] hover:bg-[#B58E52] text-white disabled:opacity-50 cursor-pointer">
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
