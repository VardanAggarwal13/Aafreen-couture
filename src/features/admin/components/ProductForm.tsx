'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import type { IProduct } from '@/types';

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  slug: z.string().optional(),
  description: z.string().min(10, 'Description is required'),
  shortDescription: z.string().optional(),
  basePrice: z.number().min(1, 'Price is required'),
  comparePrice: z.number().optional(),
  category: z.string().min(1, 'Category is required'),
  collectionRef: z.string().optional(),
  occasions: z.array(z.string()).optional(),
  fabric: z.string().optional(),
  workType: z.string().optional(),
  careInstructions: z.string().optional(),
  images: z.string().optional(),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  isNewArrival: z.boolean().optional(),
  isBestSeller: z.boolean().optional(),
  tags: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  product?: IProduct;
}

const OCCASION_OPTIONS = [
  'Engagement',
  'Haldi',
  'Mehendi',
  'Sangeet',
  'Jago',
  'Wedding',
  'Reception',
];

const STANDARD_CATEGORIES = [
  {
    group: 'Bridal',
    items: [
      { slug: 'bridal-lehengas', name: 'Bridal Lehengas' },
      { slug: 'bridal-suits', name: 'Bridal Suits' },
      { slug: 'bridesmaid-lehengas', name: 'Bridesmaid Lehengas' },
      { slug: 'reception-gowns', name: 'Reception Gowns' },
    ],
  },
  {
    group: 'Suits',
    items: [
      { slug: 'cotton-kurta-sets', name: 'Cotton Kurta Sets' },
      { slug: 'co-ord-sets', name: 'Co-ord Sets' },
      { slug: 'summer-essentials', name: 'Summer Essentials' },
      { slug: 'partywear-unstitched', name: 'Partywear Unstitched' },
      { slug: 'handcrafted-luxury', name: 'Handcrafted Luxury' },
      { slug: 'indo-western', name: 'Indo-Western' },
    ],
  },
  {
    group: 'Ready To Wear',
    items: [
      { slug: 'new-arrivals', name: 'New Arrivals' },
      { slug: 'signature-co-ords', name: 'Signature Co-Ords' },
      { slug: 'dresses', name: 'Dresses & Gowns' },
      { slug: 'sharara-sets', name: 'Sharara Sets' },
      { slug: 'occasion-lehengas', name: 'Occasion Lehengas' },
    ],
  },
  {
    group: 'Bags',
    items: [
      { slug: 'handbags', name: 'Handbags' },
      { slug: 'potlis', name: 'Potlis' },
      { slug: 'clutches', name: 'Clutches' },
      { slug: 'totes', name: 'Totes' },
      { slug: 'shoulder-bags', name: 'Shoulder Bags' },
    ],
  },
  {
    group: 'Jewellery & Accessories',
    items: [
      { slug: 'jewellery', name: 'Royal Jewellery' },
      { slug: 'the-bag-edit', name: 'The Bag Edit' },
    ],
  },
];

export function ProductForm({ product }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [customCategories, setCustomCategories] = useState<Array<{ slug: string; name: string }>>([]);

  const isEdit = !!product;

  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data)) {
          setCustomCategories(json.data);
        }
      })
      .catch(() => {});
  }, []);

  const defaultOccasions: string[] = product?.occasion
    ? (Array.isArray(product.occasion) ? product.occasion : [String(product.occasion)])
    : [];

  const initialCatSlug = typeof product?.category === 'object' && product?.category
    ? (product.category as { slug?: string }).slug || 'bridal-lehengas'
    : (product?.category as string) || 'bridal-lehengas';

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: product
      ? {
          name: product.name,
          slug: product.slug,
          description: product.description,
          shortDescription: product.shortDescription ?? '',
          basePrice: product.basePrice / 100,
          comparePrice: product.comparePrice ? product.comparePrice / 100 : undefined,
          category: initialCatSlug,
          collectionRef: typeof product.collection === 'object' && product.collection
            ? (product.collection as { slug?: string }).slug ?? ''
            : (product.collection as string) ?? '',
          occasions: defaultOccasions,
          isActive: product.isActive,
          isFeatured: product.isFeatured,
          isNewArrival: product.isNewArrival,
          isBestSeller: product.isBestSeller ?? false,
          fabric: product.fabric ?? '',
          workType: product.workType ?? '',
          careInstructions: product.careInstructions ?? '',
          images: product.images?.join(', ') ?? '',
          tags: product.tags?.join(', ') ?? '',
          seoTitle: product.seoTitle ?? '',
          seoDescription: product.seoDescription ?? '',
        }
      : {
          category: 'bridal-lehengas',
          collectionRef: '',
          occasions: [],
          isActive: true,
          isFeatured: false,
          isNewArrival: true,
          isBestSeller: false,
          images: '/images/products/noor-e-ishq.webp',
        },
  });

  const selectedOccasions = watch('occasions') ?? [];

  const toggleOccasion = (occ: string) => {
    if (selectedOccasions.includes(occ)) {
      setValue('occasions', selectedOccasions.filter((o) => o !== occ));
    } else {
      setValue('occasions', [...selectedOccasions, occ]);
    }
  };

  async function onSubmit(data: FormValues) {
    setSaving(true);
    setError('');
    try {
      const imageList = data.images
        ? data.images.split(',').map((url) => url.trim()).filter(Boolean)
        : [];

      const payload = {
        name: data.name,
        slug: data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        description: data.description,
        shortDescription: data.shortDescription,
        category: data.category,
        collectionRef: data.collectionRef || undefined,
        basePrice: Math.round(data.basePrice * 100),
        comparePrice: data.comparePrice ? Math.round(data.comparePrice * 100) : undefined,
        fabric: data.fabric,
        workType: data.workType,
        careInstructions: data.careInstructions,
        occasion: data.occasions,
        tags: data.tags ? data.tags.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean) : [],
        images: imageList,
        isActive: data.isActive,
        isFeatured: data.isFeatured,
        isNewArrival: data.isNewArrival,
        isBestSeller: data.isBestSeller,
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
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
        throw new Error(body.error ?? 'Failed to save product');
      }

      toast.success(isEdit ? 'Product updated successfully' : 'Product created successfully');
      router.push('/admin/products');
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong';
      setError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  }

  const inputClass = 'w-full bg-[#111111] border border-white/10 text-white px-4 py-2.5 text-xs focus:outline-none focus:border-[#C49A5A]/60 transition-colors placeholder:text-white/25 rounded-xs';
  const labelClass = 'block text-[10.5px] font-semibold uppercase tracking-wider text-white/50 mb-1.5';
  const errorClass = 'text-xs text-red-400 mt-1';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl space-y-6">
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 text-xs text-red-400 rounded-xs">
          {error}
        </div>
      )}

      {/* Basic Information */}
      <div className="bg-[#1A1A1A] border border-white/5 p-6 space-y-5 rounded-xs">
        <h2 className="text-xs font-semibold text-white/70 uppercase tracking-[0.2em] pb-3 border-b border-white/5">
          Basic Information
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Product Name *</label>
            <input {...register('name')} className={inputClass} placeholder="e.g. Noor-e-Ishq Royal Bridal Lehenga" />
            {errors.name && <p className={errorClass}>{errors.name.message}</p>}
          </div>

          <div>
            <label className={labelClass}>Slug (Auto-generated if empty)</label>
            <input {...register('slug')} className={inputClass} placeholder="noor-e-ishq-royal-bridal-lehenga" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Category & Subcategory *</label>
            <select {...register('category')} className={inputClass}>
              {STANDARD_CATEGORIES.map((grp) => (
                <optgroup key={grp.group} label={grp.group}>
                  {grp.items.map((item) => (
                    <option key={item.slug} value={item.slug}>
                      {item.name}
                    </option>
                  ))}
                </optgroup>
              ))}
              {customCategories.length > 0 && (
                <optgroup label="Custom Boutique Categories">
                  {customCategories.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </optgroup>
              )}
            </select>
            {errors.category && <p className={errorClass}>{errors.category.message}</p>}
          </div>

          <div>
            <label className={labelClass}>Collection</label>
            <select {...register('collectionRef')} className={inputClass}>
              <option value="">None / Standalone</option>
              <option value="bridal-lehengas-suits">Bridal Collection</option>
              <option value="signature-co-ord-sets">Signature Co-Ord Sets</option>
              <option value="the-bag-edit">The Bag Edit</option>
              <option value="saree-edit">The Saree Edit</option>
            </select>
          </div>
        </div>

        <div>
          <label className={labelClass}>Short Tagline / Summary</label>
          <input {...register('shortDescription')} className={inputClass} placeholder="e.g. Handcrafted crimson velvet bridal lehenga with antique gold zardozi" />
        </div>

        <div>
          <label className={labelClass}>Full Atelier Story & Craftsmanship Description *</label>
          <textarea {...register('description')} rows={4} className={inputClass} placeholder="Describe the royal craftsmanship, silhouette, fabrics, and artisanal heritage of the piece…" />
          {errors.description && <p className={errorClass}>{errors.description.message}</p>}
        </div>
      </div>

      {/* Occasions (Dynamic navigation linking) */}
      <div className="bg-[#1A1A1A] border border-white/5 p-6 space-y-4 rounded-xs">
        <div>
          <h2 className="text-xs font-semibold text-white/70 uppercase tracking-[0.2em]">
            Occasions (Shop By Occasion)
          </h2>
          <p className="text-[11px] text-white/40 mt-1">
            Tagging an occasion automatically displays this ensemble on that occasion&apos;s dedicated page (e.g. /occasions/haldi).
          </p>
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          {OCCASION_OPTIONS.map((occ) => {
            const isSelected = selectedOccasions.includes(occ);
            return (
              <button
                key={occ}
                type="button"
                onClick={() => toggleOccasion(occ)}
                className={`px-3 py-1.5 text-xs font-medium uppercase tracking-wider rounded-xs border transition-colors ${
                  isSelected
                    ? 'border-[#C49A5A] bg-[#C49A5A]/20 text-[#C49A5A]'
                    : 'border-white/10 text-white/50 hover:border-white/30 hover:text-white'
                }`}
              >
                {occ} {isSelected && '✓'}
              </button>
            );
          })}
        </div>
      </div>

      {/* Pricing & Craftsmanship Details */}
      <div className="bg-[#1A1A1A] border border-white/5 p-6 space-y-5 rounded-xs">
        <h2 className="text-xs font-semibold text-white/70 uppercase tracking-[0.2em] pb-3 border-b border-white/5">
          Pricing & Textiles
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Price in ₹ (INR) *</label>
            <input {...register('basePrice', { valueAsNumber: true })} type="number" step="1" className={inputClass} placeholder="89999" />
            {errors.basePrice && <p className={errorClass}>{errors.basePrice.message}</p>}
          </div>

          <div>
            <label className={labelClass}>Compare Price in ₹ (Original M.R.P.)</label>
            <input {...register('comparePrice', { valueAsNumber: true })} type="number" step="1" className={inputClass} placeholder="109999" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Fabric</label>
            <input {...register('fabric')} className={inputClass} placeholder="Pure Silk Velvet, Organza" />
          </div>
          <div>
            <label className={labelClass}>Work Type</label>
            <input {...register('workType')} className={inputClass} placeholder="Real Zardozi, Cutdana, Dabka" />
          </div>
          <div>
            <label className={labelClass}>Care Instructions</label>
            <input {...register('careInstructions')} className={inputClass} placeholder="Dry clean only" />
          </div>
        </div>

        <div>
          <label className={labelClass}>Image URLs / Paths (comma separated) *</label>
          <input {...register('images')} className={inputClass} placeholder="/images/products/noor-e-ishq.webp, /images/products/zarafshan.webp" />
          <p className="text-[10px] text-white/30 mt-1">First image will be used as the primary showcase image.</p>
        </div>

        <div>
          <label className={labelClass}>Tags (comma separated)</label>
          <input {...register('tags')} className={inputClass} placeholder="bridal, lehenga, silk, velvet, wedding, zardozi" />
        </div>
      </div>

      {/* Visibility Flags */}
      <div className="bg-[#1A1A1A] border border-white/5 p-6 space-y-4 rounded-xs">
        <h2 className="text-xs font-semibold text-white/70 uppercase tracking-[0.2em] pb-3 border-b border-white/5">
          Visibility & Placement
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input {...register('isActive')} type="checkbox" className="accent-[#C49A5A] w-4 h-4" />
            <span className="text-xs text-white/80">Active in Store</span>
          </label>
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input {...register('isFeatured')} type="checkbox" className="accent-[#C49A5A] w-4 h-4" />
            <span className="text-xs text-white/80">Featured</span>
          </label>
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input {...register('isNewArrival')} type="checkbox" className="accent-[#C49A5A] w-4 h-4" />
            <span className="text-xs text-white/80">New Arrival</span>
          </label>
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input {...register('isBestSeller')} type="checkbox" className="accent-[#C49A5A] w-4 h-4" />
            <span className="text-xs text-white/80">Best Seller</span>
          </label>
        </div>
      </div>

      {/* SEO */}
      <div className="bg-[#1A1A1A] border border-white/5 p-6 space-y-4 rounded-xs">
        <h2 className="text-xs font-semibold text-white/70 uppercase tracking-[0.2em] pb-3 border-b border-white/5">
          SEO & Social Metadata
        </h2>
        <div>
          <label className={labelClass}>Meta Title</label>
          <input {...register('seoTitle')} className={inputClass} placeholder="Noor-e-Ishq Royal Velvet Bridal Lehenga | Aafreen Couture" />
        </div>
        <div>
          <label className={labelClass}>Meta Description</label>
          <textarea {...register('seoDescription')} rows={2} className={inputClass} placeholder="Discover handcrafted royal crimson velvet bridal lehenga with antique gold zardozi…" />
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex items-center gap-4 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="bg-[#C49A5A] hover:bg-[#A67C52] text-white text-xs font-semibold tracking-[0.2em] uppercase px-8 py-3.5 transition-colors disabled:opacity-50 rounded-xs shadow-md"
        >
          {saving ? 'Saving Ensembles…' : isEdit ? 'Update Product' : 'Create Product'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="text-xs uppercase tracking-wider text-white/50 hover:text-white transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
