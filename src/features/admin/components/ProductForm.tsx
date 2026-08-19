'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import type { IProduct } from '@/types';

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  slug: z.string().optional(),
  description: z.string().min(10, 'Description is required'),
  basePrice: z.number().min(1, 'Price is required'),
  comparePrice: z.number().optional(),
  category: z.string().min(1, 'Category is required'),
  fabric: z.string().optional(),
  workType: z.string().optional(),
  images: z.string().optional(),
  isActive: z.boolean(),
  isFeatured: z.boolean(),
  isNewArrival: z.boolean(),
  isBestSeller: z.boolean(),
  tags: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  product?: IProduct;
}

export function ProductForm({ product }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const isEdit = !!product;

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: product
      ? {
          name: product.name,
          slug: product.slug,
          description: product.description,
          basePrice: product.basePrice / 100,
          comparePrice: product.comparePrice ? product.comparePrice / 100 : undefined,
          category: typeof product.category === 'string' ? product.category : ((product.category as { slug?: string; name?: string })?.slug || 'bridal-lehengas-suits'),
          isActive: product.isActive,
          isFeatured: product.isFeatured,
          isNewArrival: product.isNewArrival,
          isBestSeller: product.isBestSeller ?? false,
          fabric: product.fabric ?? '',
          workType: product.workType ?? '',
          images: product.images?.join(', ') ?? '',
          tags: product.tags?.join(', ') ?? '',
          seoTitle: product.seoTitle ?? '',
          seoDescription: product.seoDescription ?? '',
        }
      : {
          category: 'bridal-lehengas-suits',
          isActive: true,
          isFeatured: false,
          isNewArrival: true,
          isBestSeller: false,
          images: '/images/products/noor-e-ishq.webp',
        },
  });

  async function onSubmit(data: FormValues) {
    setSaving(true);
    setError('');
    try {
      const imageList = data.images
        ? data.images.split(',').map((url, idx) => ({
            url: url.trim(),
            alt: `${data.name} View ${idx + 1}`,
            isPrimary: idx === 0,
            sortOrder: idx,
          })).filter((img) => Boolean(img.url))
        : [];

      const payload = {
        ...data,
        slug: data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        basePrice: Math.round(data.basePrice * 100),
        comparePrice: data.comparePrice ? Math.round(data.comparePrice * 100) : undefined,
        tags: data.tags ? data.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
        images: imageList,
      };

      const url = isEdit ? `/api/products/${product._id}` : '/api/products';
      const method = isEdit ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error ?? 'Failed to save');
      }

      router.push('/admin/products');
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSaving(false);
    }
  }

  const inputClass = 'w-full bg-[#111111] border border-white/10 text-white px-4 py-2.5 text-sm focus:outline-none focus:border-brand-gold/50 transition-colors placeholder:text-white/25';
  const labelClass = 'block text-[10px] font-semibold uppercase tracking-wider text-white/50 mb-1.5';
  const errorClass = 'text-xs text-red-400 mt-1';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl space-y-6">
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 text-sm text-red-400">{error}</div>
      )}

      {/* Basic info */}
      <div className="bg-[#1A1A1A] border border-white/5 p-6 space-y-5">
        <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider">Basic Information</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Product Name *</label>
            <input {...register('name')} className={inputClass} placeholder="e.g. Noor-e-Ishq Royal Bridal Lehenga" />
            {errors.name && <p className={errorClass}>{errors.name.message}</p>}
          </div>

          <div>
            <label className={labelClass}>Slug</label>
            <input {...register('slug')} className={inputClass} placeholder="noor-e-ishq-royal-bridal-lehenga" />
          </div>
        </div>

        <div>
          <label className={labelClass}>Category *</label>
          <select {...register('category')} className={inputClass}>
            <option value="bridal-lehengas-suits">Bridal Lehengas & Suits</option>
            <option value="festive-wear">Festive Wear</option>
            <option value="anarkalis">Royal Anarkalis</option>
            <option value="sharara-gharara">Shararas & Ghararas</option>
            <option value="sarees">Heritage Sarees</option>
            <option value="contemporary-fusion">Contemporary Fusion</option>
            <option value="signature-co-ord-sets">Signature Co-Ord Sets</option>
            <option value="jewellery">Jadau Jewellery</option>
            <option value="accessories">Luxury Potlis & Accessories</option>
          </select>
          {errors.category && <p className={errorClass}>{errors.category.message}</p>}
        </div>

        <div>
          <label className={labelClass}>Description *</label>
          <textarea {...register('description')} rows={4} className={inputClass} placeholder="Describe the craftsmanship, silhouette, and story of the piece…" />
          {errors.description && <p className={errorClass}>{errors.description.message}</p>}
        </div>

        <div>
          <label className={labelClass}>Image URLs / Paths (comma separated)</label>
          <input {...register('images')} className={inputClass} placeholder="/images/products/noor-e-ishq.webp, /images/products/zarafshan.webp" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Price (₹) *</label>
            <input {...register('basePrice', { valueAsNumber: true })} type="number" step="0.01" className={inputClass} placeholder="e.g. 89999" />
            {errors.basePrice && <p className={errorClass}>{errors.basePrice.message}</p>}
          </div>
          <div>
            <label className={labelClass}>Compare Price (₹)</label>
            <input {...register('comparePrice', { valueAsNumber: true })} type="number" step="0.01" className={inputClass} placeholder="e.g. 109999" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Fabric</label>
            <input {...register('fabric')} className={inputClass} placeholder="e.g. Pure Silk Velvet, Organza" />
          </div>
          <div>
            <label className={labelClass}>Work Type</label>
            <input {...register('workType')} className={inputClass} placeholder="e.g. Real Zardozi, Marodi & Dabka" />
          </div>
        </div>

        <div>
          <label className={labelClass}>Tags (comma separated)</label>
          <input {...register('tags')} className={inputClass} placeholder="bridal, lehenga, silk, wedding" />
        </div>
      </div>

      {/* Flags */}
      <div className="bg-[#1A1A1A] border border-white/5 p-6">
        <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-5">Visibility & Flags</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {(['isActive', 'isFeatured', 'isNewArrival', 'isBestSeller'] as const).map((field) => (
            <label key={field} className="flex items-center gap-2.5 cursor-pointer">
              <input
                {...register(field)}
                type="checkbox"
                className="w-4 h-4 border border-white/20 bg-[#111111] checked:bg-brand-gold checked:border-brand-gold accent-brand-gold rounded-sm"
              />
              <span className="text-xs text-white/70 capitalize">{field.replace('is', '')}</span>
            </label>
          ))}
        </div>
      </div>

      {/* SEO */}
      <div className="bg-[#1A1A1A] border border-white/5 p-6 space-y-4">
        <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider">SEO</h2>
        <div>
          <label className={labelClass}>Meta Title</label>
          <input {...register('seoTitle')} className={inputClass} placeholder="SEO page title" />
        </div>
        <div>
          <label className={labelClass}>Meta Description</label>
          <textarea {...register('seoDescription')} rows={2} className={inputClass} placeholder="SEO description (up to 160 characters)" />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={saving}
          className="bg-brand-gold text-white text-[11px] font-semibold tracking-[0.22em] uppercase px-8 py-3 hover:bg-[#b8893f] transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving…' : isEdit ? 'Update Product' : 'Create Product'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="text-sm text-white/50 hover:text-white transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
