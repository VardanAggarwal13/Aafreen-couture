'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useForm, useFieldArray, type FieldPath, type FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { X, Plus, Trash2 } from 'lucide-react';
import { extractFieldErrors, FIELD_ERROR_CLASS } from '@/utils/form-errors';
import type { IProduct } from '@/types';

const FIELD_LABELS: Record<string, string> = {
  name: 'Product Name',
  slug: 'Slug',
  category: 'Category & Subcategory',
  collectionRef: 'Collection',
  description: 'Full Description',
  shortDescription: 'Short Tagline',
  basePrice: 'Price',
  comparePrice: 'Compare Price',
  images: 'Product Images',
  seoTitle: 'Meta Title',
  seoDescription: 'Meta Description',
  fabric: 'Fabric',
  workType: 'Work Type',
  careInstructions: 'Care Instructions',
  tags: 'Tags',
  variants: 'Sizes & Stock',
  size: 'Size',
  color: 'Color',
  sku: 'SKU',
  price: 'Price',
  stock: 'Stock',
};

function formatFieldErrorLabel(path: string): string {
  if (path.startsWith('variants.')) {
    const parts = path.split('.');
    const index = parseInt(parts[1], 10);
    const subfield = parts[2] || '';
    const subLabel = FIELD_LABELS[subfield] || subfield;
    return `Size #${index + 1} ${subLabel}`;
  }
  return FIELD_LABELS[path] || path;
}

const variantSchema = z.object({
  size: z.string().optional(),
  color: z.string().optional(),
  sku: z.string().min(1, 'SKU is required'),
  price: z.number({ message: 'Enter a valid price' }).min(1, 'Price is required'),
  comparePrice: z.number().optional(),
  stock: z.number({ message: 'Enter a valid stock quantity' }).int('Stock must be a whole number').min(0, 'Stock cannot be negative'),
  isActive: z.boolean().optional(),
});

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  slug: z.string().optional(),
  description: z.string().min(10, 'Description is required'),
  shortDescription: z.string().max(500, 'Tagline cannot exceed 500 characters').optional(),
  basePrice: z.number({ message: 'Price is required' }).min(1, 'Price must be greater than 0'),
  comparePrice: z.number().optional(),
  category: z.string().min(1, 'Category is required'),
  collectionRef: z.string().optional(),
  occasions: z.array(z.string()).optional(),
  fabric: z.string().optional(),
  workType: z.string().optional(),
  careInstructions: z.string().optional(),
  images: z.string().optional(),
  variants: z.array(variantSchema).min(1, 'Add at least one size / variant'),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  isNewArrival: z.boolean().optional(),
  isBestSeller: z.boolean().optional(),
  tags: z.string().optional(),
  seoTitle: z.string().max(160, 'Meta title cannot exceed 160 characters').optional(),
  seoDescription: z.string().max(500, 'Meta description cannot exceed 500 characters').optional(),
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

export function ProductForm({ product }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [categories, setCategories] = useState<Array<{ slug: string; name: string }>>([]);
  const [collections, setCollections] = useState<Array<{ slug: string; name: string }>>([]);

  const isEdit = !!product;

  useEffect(() => {
    // includeInactive so an existing product's current category/collection still shows even
    // if it was since deactivated — otherwise the select silently jumps to another option on save.
    fetch('/api/categories?includeInactive=true')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data)) {
          setCategories(json.data);
        }
      })
      .catch(() => {});
    fetch('/api/collections?includeInactive=true')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data)) {
          setCollections(json.data);
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

  const { register, handleSubmit, watch, setValue, setError, control, formState: { errors } } = useForm<FormValues>({
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
          variants: product.variants?.length
            ? product.variants.map((v) => ({
                size: v.size ?? '',
                color: v.color ?? '',
                sku: v.sku,
                price: v.price / 100,
                comparePrice: v.comparePrice ? v.comparePrice / 100 : undefined,
                stock: v.stock,
                isActive: v.isActive,
              }))
            : [{ size: '', color: '', sku: '', price: product.basePrice / 100, stock: 0, isActive: true }],
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
          variants: [{ size: '', color: '', sku: '', price: 0, stock: 0, isActive: true }],
        },
  });

  const { fields: variantFields, append: appendVariant, remove: removeVariant } = useFieldArray({
    control,
    name: 'variants',
  });

  const selectedOccasions = watch('occasions') ?? [];
  const imagesValue = watch('images') ?? '';
  const imageList = imagesValue.split(',').map((url) => url.trim()).filter(Boolean);
  const seoTitleWatch = watch('seoTitle') ?? '';
  const seoDescWatch = watch('seoDescription') ?? '';
  const [syncVariantPrices, setSyncVariantPrices] = useState(true);

  const applyPriceToAllVariants = (customBasePrice?: number, customComparePrice?: number) => {
    const p = customBasePrice !== undefined ? customBasePrice : Number(watch('basePrice') || 0);
    const cp = customComparePrice !== undefined ? customComparePrice : (watch('comparePrice') ? Number(watch('comparePrice')) : undefined);
    variantFields.forEach((_, idx) => {
      setValue(`variants.${idx}.price`, p, { shouldValidate: true, shouldDirty: true });
      if (cp !== undefined) {
        setValue(`variants.${idx}.comparePrice`, cp, { shouldValidate: true, shouldDirty: true });
      }
    });
    toast.success(`Synchronized all sizes to ₹${p.toLocaleString('en-IN')}`);
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  function addImageUrls(urls: string[]) {
    const merged = [...imageList, ...urls];
    setValue('images', merged.join(', '));
  }

  function removeImageAt(index: number) {
    const next = imageList.filter((_, i) => i !== index);
    setValue('images', next.join(', '));
  }

  async function handleFilesSelected(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const sigRes = await fetch('/api/admin/upload', { method: 'POST' });
      const sigJson = await sigRes.json();
      if (!sigRes.ok || !sigJson.success) {
        throw new Error(sigJson.error ?? 'Failed to prepare image upload');
      }
      const { signature, timestamp, cloudName, apiKey, folder } = sigJson.data;

      const uploadedUrls: string[] = [];
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('api_key', apiKey);
        formData.append('timestamp', String(timestamp));
        formData.append('signature', signature);
        formData.append('folder', folder);

        const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: 'POST',
          body: formData,
        });
        const uploadJson = await uploadRes.json();
        if (!uploadRes.ok || !uploadJson.secure_url) {
          throw new Error(uploadJson.error?.message ?? `Failed to upload ${file.name}`);
        }
        uploadedUrls.push(uploadJson.secure_url as string);
      }

      addImageUrls(uploadedUrls);
      toast.success(`${uploadedUrls.length} image${uploadedUrls.length > 1 ? 's' : ''} uploaded`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Image upload failed';
      toast.error(msg);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  const toggleOccasion = (occ: string) => {
    if (selectedOccasions.includes(occ)) {
      setValue('occasions', selectedOccasions.filter((o) => o !== occ));
    } else {
      setValue('occasions', [...selectedOccasions, occ]);
    }
  };

  async function onSubmit(data: FormValues) {
    setSaving(true);
    setFormError('');
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
        variants: data.variants.map((v) => {
          const finalPrice = syncVariantPrices ? data.basePrice : (v.price || data.basePrice);
          const finalComparePrice = syncVariantPrices ? data.comparePrice : v.comparePrice;
          return {
            size: v.size || undefined,
            color: v.color || undefined,
            sku: v.sku,
            price: Math.round(finalPrice * 100),
            comparePrice: finalComparePrice ? Math.round(finalComparePrice * 100) : undefined,
            stock: Math.round(v.stock),
            images: [] as string[],
            isActive: v.isActive ?? true,
          };
        }),
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
        const body = await res.json().catch(() => ({}));
        const fieldErrors = extractFieldErrors(body);
        if (fieldErrors.length > 0) {
          fieldErrors.forEach((fe) => {
            setError(fe.path as FieldPath<FormValues>, { type: 'server', message: fe.message });
          });
          const detailedList = fieldErrors.map((fe) => `${formatFieldErrorLabel(fe.path)}: ${fe.message}`);
          setFormError(`Please fix the following issue${fieldErrors.length > 1 ? 's' : ''}:\n• ${detailedList.join('\n• ')}`);
          toast.error(`Please fix ${fieldErrors.length} field error${fieldErrors.length > 1 ? 's' : ''}`);
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
        throw new Error(body.error ?? 'Failed to save product');
      }

      toast.success(isEdit ? 'Product updated successfully' : 'Product created successfully');
      router.push('/admin/products');
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong';
      setFormError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  }

  const onInvalid = (fieldErrors: FieldErrors<FormValues>) => {
    const errorList: string[] = [];
    Object.entries(fieldErrors).forEach(([field, err]) => {
      if (field === 'variants' && Array.isArray(err)) {
        err.forEach((vErr, idx) => {
          if (vErr) {
            Object.entries(vErr).forEach(([subField, subErr]) => {
              if (subErr && typeof subErr === 'object' && 'message' in subErr && subErr.message) {
                errorList.push(`Size #${idx + 1} ${FIELD_LABELS[subField] || subField}: ${subErr.message}`);
              }
            });
          }
        });
      } else if (err && typeof err === 'object' && 'message' in err && err.message) {
        errorList.push(`${FIELD_LABELS[field] || field}: ${err.message}`);
      }
    });

    if (errorList.length > 0) {
      setFormError(`Please fix the following issue${errorList.length > 1 ? 's' : ''}:\n• ${errorList.join('\n• ')}`);
      toast.error('Please fix the highlighted fields in the form');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const inputClass = 'w-full bg-[#FAF7F2] border border-[#DDD2C5] text-[#2E221C] px-3.5 py-2 text-xs focus:outline-none focus:border-[#C9A86A] transition-colors placeholder:text-[#8A6A55]/50 rounded-lg';
  const labelClass = 'block text-[10.5px] font-semibold uppercase tracking-wider text-[#8A6A55] mb-1.5';
  const errorClass = 'text-xs text-red-600 mt-1 font-medium';
  const fieldClass = (hasError: boolean | undefined) => (hasError ? `${inputClass} ${FIELD_ERROR_CLASS}` : inputClass);

  return (
    <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="max-w-4xl mx-auto space-y-4 font-sans">
      {formError && (
        <div className="p-4 bg-red-50 border-2 border-red-300 text-xs text-red-800 rounded-xl whitespace-pre-line shadow-xs">
          <div className="font-semibold text-red-900 mb-1.5 flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-red-600 animate-pulse" />
            Please resolve the following before saving:
          </div>
          {formError}
        </div>
      )}

      {/* Basic Information */}
      <div className="bg-white p-4 space-y-4 rounded-xl shadow-sm">
        <h2 className="text-xs font-sans font-bold text-[#2E221C] uppercase tracking-[0.15em] pb-2 border-b border-[#EAE2D7]">
          Basic Information
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Product Name *</label>
            <input {...register('name')} className={fieldClass(!!errors.name)} placeholder="e.g. Noor-e-Ishq Royal Bridal Lehenga" />
            {errors.name && <p className={errorClass}>{errors.name.message}</p>}
          </div>

          <div>
            <label className={labelClass}>Slug (Auto-generated if empty)</label>
            <input {...register('slug')} className={fieldClass(!!errors.slug)} placeholder="noor-e-ishq-royal-bridal-lehenga" />
            {errors.slug && <p className={errorClass}>{errors.slug.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Category & Subcategory *</label>
            <select {...register('category')} className={fieldClass(!!errors.category)}>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
            {errors.category && <p className={errorClass}>{errors.category.message}</p>}
          </div>

          <div>
            <label className={labelClass}>Collection</label>
            <select {...register('collectionRef')} className={fieldClass(!!errors.collectionRef)}>
              <option value="">None / Standalone</option>
              {collections.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
            {errors.collectionRef && <p className={errorClass}>{errors.collectionRef.message}</p>}
          </div>
        </div>

        <div>
          <label className={labelClass}>Short Tagline / Summary</label>
          <input {...register('shortDescription')} className={fieldClass(!!errors.shortDescription)} placeholder="e.g. Handcrafted crimson velvet bridal lehenga with antique gold zardozi" />
          {errors.shortDescription && <p className={errorClass}>{errors.shortDescription.message}</p>}
        </div>

        <div>
          <label className={labelClass}>Full Atelier Story & Craftsmanship Description *</label>
          <textarea {...register('description')} rows={4} className={fieldClass(!!errors.description)} placeholder="Describe the royal craftsmanship, silhouette, fabrics, and artisanal heritage of the piece…" />
          {errors.description && <p className={errorClass}>{errors.description.message}</p>}
        </div>
      </div>

      {/* Occasions (Dynamic navigation linking) */}
      <div className="bg-white p-4 space-y-4 rounded-xl shadow-sm">
        <div>
          <h2 className="text-xs font-sans font-bold text-[#2E221C] uppercase tracking-[0.15em]">
            Occasions (Shop By Occasion)
          </h2>
          <p className="text-[11px] text-[#8A6A55] mt-1">
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
                className={`px-3 py-1.5 text-xs font-medium uppercase tracking-wider rounded-lg border transition-colors cursor-pointer ${
                  isSelected
                    ? 'border-[#C9A86A] bg-[#C9A86A]/20 text-[#9E7B3A] font-semibold'
                    : 'border-[#DDD2C5] bg-[#FAF7F2] text-[#8A6A55] hover:border-[#C9A86A] hover:text-[#2E221C]'
                }`}
              >
                {occ} {isSelected && '✓'}
              </button>
            );
          })}
        </div>
      </div>

      {/* Pricing & Craftsmanship Details */}
      <div className="bg-white p-4 space-y-4 rounded-xl shadow-sm">
        <h2 className="text-xs font-sans font-bold text-[#2E221C] uppercase tracking-[0.15em] pb-2 border-b border-[#EAE2D7]">
          Pricing &amp; Textiles
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Price in ₹ (INR) *</label>
            <input
              {...register('basePrice', {
                setValueAs: (v) => (v === '' || isNaN(v) ? 0 : Number(v)),
                onChange: (e) => {
                  if (syncVariantPrices) {
                    const val = Number(e.target.value) || 0;
                    variantFields.forEach((_, idx) => {
                      setValue(`variants.${idx}.price`, val, { shouldValidate: true, shouldDirty: true });
                    });
                  }
                },
              })}
              type="number"
              step="1"
              className={fieldClass(!!errors.basePrice)}
              placeholder="89999"
            />
            {errors.basePrice && <p className={errorClass}>{errors.basePrice.message}</p>}
          </div>

          <div>
            <label className={labelClass}>Compare Price in ₹ (Original M.R.P.)</label>
            <input
              {...register('comparePrice', {
                setValueAs: (v) => (v === '' || isNaN(v) ? undefined : Number(v)),
                onChange: (e) => {
                  if (syncVariantPrices) {
                    const val = e.target.value === '' ? undefined : Number(e.target.value);
                    variantFields.forEach((_, idx) => {
                      setValue(`variants.${idx}.comparePrice`, val, { shouldValidate: true, shouldDirty: true });
                    });
                  }
                },
              })}
              type="number"
              step="1"
              className={fieldClass(!!errors.comparePrice)}
              placeholder="109999"
            />
            {errors.comparePrice && <p className={errorClass}>{errors.comparePrice.message}</p>}
          </div>
        </div>

        {/* Real-time price sync toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-[#FAF7F2] border border-[#C9A86A]/30 rounded-lg text-xs">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={syncVariantPrices}
              onChange={(e) => {
                setSyncVariantPrices(e.target.checked);
                if (e.target.checked) applyPriceToAllVariants();
              }}
              className="accent-[#C9A86A] w-4 h-4 rounded cursor-pointer"
            />
            <span className="text-[#2E221C] font-semibold text-[11px]">
              Automatically sync this price across all sizes / variants
            </span>
          </label>
          <button
            type="button"
            onClick={() => applyPriceToAllVariants()}
            className="text-[11px] font-semibold text-[#9E7B3A] hover:text-[#2E221C] bg-white border border-[#C9A86A]/50 px-3 py-1 rounded-md transition-colors cursor-pointer shadow-2xs hover:bg-[#C9A86A]/10"
          >
            ⚡ Apply to All Sizes
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className={labelClass}>Fabric</label>
            <input {...register('fabric')} className={fieldClass(!!errors.fabric)} placeholder="Pure Raw Silk, Organza" />
            {errors.fabric && <p className={errorClass}>{errors.fabric.message}</p>}
          </div>
          <div>
            <label className={labelClass}>Work Type</label>
            <input {...register('workType')} className={fieldClass(!!errors.workType)} placeholder="Real Zardozi, Cutdana, Dabka" />
            {errors.workType && <p className={errorClass}>{errors.workType.message}</p>}
          </div>
          <div>
            <label className={labelClass}>Care Instructions</label>
            <input {...register('careInstructions')} className={fieldClass(!!errors.careInstructions)} placeholder="Dry clean only" />
            {errors.careInstructions && <p className={errorClass}>{errors.careInstructions.message}</p>}
          </div>
        </div>

        <div>
          <label className={labelClass}>Product Images *</label>

          {imageList.length > 0 && (
            <div className="flex flex-wrap gap-3 mb-2">
              {imageList.map((url, index) => (
                <div key={`${url}-${index}`} className="relative w-20 h-20 rounded-lg overflow-hidden border border-[#DDD2C5] group">
                  <Image src={url} alt={`Product image ${index + 1}`} fill sizes="80px" className="object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImageAt(index)}
                    className="absolute top-0.5 right-0.5 bg-black/60 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    aria-label="Remove image"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  {index === 0 && (
                    <span className="absolute bottom-0 inset-x-0 bg-[#C9A86A] text-white text-[8px] uppercase tracking-wider text-center py-0.5">
                      Primary
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center gap-3 mb-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleFilesSelected(e.target.files)}
              disabled={uploading}
              className="hidden"
              id="product-image-upload"
            />
            <label
              htmlFor="product-image-upload"
              className={`inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider px-3.5 py-2 border border-[#C9A86A] text-[#9E7B3A] rounded-lg cursor-pointer hover:bg-[#C9A86A]/10 transition-colors ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
            >
              {uploading ? 'Uploading…' : 'Upload Images'}
            </label>
          </div>

          <input {...register('images')} className={fieldClass(!!errors.images)} placeholder="/images/products/noorani-moonstone-lilac-silk-suit-1.webp, /images/products/noorani-moonstone-lilac-silk-suit-2.webp" />
          {errors.images && <p className={errorClass}>{errors.images.message}</p>}
          <p className="text-[10px] text-[#8A6A55] mt-1">Upload directly to Cloudinary, or paste image URLs / static paths above (comma separated). First image is used as the primary showcase hero image.</p>
        </div>

        <div>
          <label className={labelClass}>Tags (comma separated)</label>
          <input {...register('tags')} className={fieldClass(!!errors.tags)} placeholder="suits, silk, zardozi, unstitched, wedding" />
          {errors.tags && <p className={errorClass}>{errors.tags.message}</p>}
        </div>
      </div>

      {/* Sizes & Stock (Variants) */}
      <div className="bg-white p-4 space-y-4 rounded-xl shadow-sm">
        <div className="flex items-center justify-between pb-2 border-b border-[#EAE2D7]">
          <div>
            <h2 className="text-xs font-sans font-bold text-[#2E221C] uppercase tracking-[0.15em]">
              Sizes &amp; Stock *
            </h2>
            <p className="text-[11px] text-[#8A6A55] mt-1">
              Every ensemble needs at least one size/variant with its own SKU, price, and stock quantity.
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              appendVariant({ size: '', color: '', sku: '', price: 0, stock: 0, isActive: true })
            }
            className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider px-3 py-1.5 border border-[#C9A86A] text-[#9E7B3A] rounded-lg hover:bg-[#C9A86A]/10 transition-colors cursor-pointer"
          >
            <Plus size={13} /> Add Size
          </button>
        </div>

        {errors.variants && !Array.isArray(errors.variants) && (
          <p className={errorClass}>{errors.variants.message}</p>
        )}

        <div className="space-y-3">
          {variantFields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-2 sm:grid-cols-6 gap-2.5 p-3 bg-[#FAF7F2] rounded-lg border border-[#EAE2D7]">
              <div>
                <label className={labelClass}>Size</label>
                <input {...register(`variants.${index}.size`)} className={fieldClass(!!errors.variants?.[index]?.size)} placeholder="M / Free Size" />
                {errors.variants?.[index]?.size && <p className={errorClass}>{errors.variants[index]?.size?.message}</p>}
              </div>
              <div>
                <label className={labelClass}>Color</label>
                <input {...register(`variants.${index}.color`)} className={fieldClass(!!errors.variants?.[index]?.color)} placeholder="Rani Pink" />
                {errors.variants?.[index]?.color && <p className={errorClass}>{errors.variants[index]?.color?.message}</p>}
              </div>
              <div>
                <label className={labelClass}>SKU *</label>
                <input {...register(`variants.${index}.sku`)} className={fieldClass(!!errors.variants?.[index]?.sku)} placeholder="AFR-1001-M" />
                {errors.variants?.[index]?.sku && (
                  <p className={errorClass}>{errors.variants[index]?.sku?.message}</p>
                )}
              </div>
              <div>
                <label className={labelClass}>Price ₹ *</label>
                <input {...register(`variants.${index}.price`, { setValueAs: (v) => (v === '' || isNaN(v) ? 0 : Number(v)) })} type="number" step="1" className={fieldClass(!!errors.variants?.[index]?.price)} placeholder="89999" />
                {errors.variants?.[index]?.price && (
                  <p className={errorClass}>{errors.variants[index]?.price?.message}</p>
                )}
              </div>
              <div>
                <label className={labelClass}>Stock *</label>
                <input {...register(`variants.${index}.stock`, { setValueAs: (v) => (v === '' || isNaN(v) ? 0 : Number(v)) })} type="number" step="1" className={fieldClass(!!errors.variants?.[index]?.stock)} placeholder="5" />
                {errors.variants?.[index]?.stock && (
                  <p className={errorClass}>{errors.variants[index]?.stock?.message}</p>
                )}
              </div>
              <div className="flex items-end justify-between gap-2">
                <label className="flex items-center gap-1.5 cursor-pointer pb-2">
                  <input {...register(`variants.${index}.isActive`)} type="checkbox" defaultChecked className="accent-[#C9A86A] w-3.5 h-3.5" />
                  <span className="text-[10.5px] text-[#2E221C] font-medium">Active</span>
                </label>
                <button
                  type="button"
                  onClick={() => removeVariant(index)}
                  disabled={variantFields.length <= 1}
                  className="p-1.5 text-[#8A6A55] hover:text-red-600 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  aria-label="Remove size"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Visibility Flags */}
      <div className="bg-white p-4 space-y-4 rounded-xl shadow-sm">
        <h2 className="text-xs font-sans font-bold text-[#2E221C] uppercase tracking-[0.15em] pb-2 border-b border-[#EAE2D7]">
          Visibility &amp; Placement
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input {...register('isActive')} type="checkbox" className="accent-[#C9A86A] w-4 h-4" />
            <span className="text-xs text-[#2E221C] font-medium">Active in Store</span>
          </label>
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input {...register('isFeatured')} type="checkbox" className="accent-[#C9A86A] w-4 h-4" />
            <span className="text-xs text-[#2E221C] font-medium">Featured</span>
          </label>
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input {...register('isNewArrival')} type="checkbox" className="accent-[#C9A86A] w-4 h-4" />
            <span className="text-xs text-[#2E221C] font-medium">New Arrival</span>
          </label>
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input {...register('isBestSeller')} type="checkbox" className="accent-[#C9A86A] w-4 h-4" />
            <span className="text-xs text-[#2E221C] font-medium">Best Seller</span>
          </label>
        </div>
      </div>

      {/* SEO */}
      <div className="bg-white p-4 space-y-4 rounded-xl shadow-sm">
        <h2 className="text-xs font-sans font-bold text-[#2E221C] uppercase tracking-[0.15em] pb-2 border-b border-[#EAE2D7]">
          SEO &amp; Social Metadata
        </h2>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className={labelClass}>Meta Title</label>
            <span className={`text-[10px] ${seoTitleWatch.length > 70 ? 'text-[#C9A86A] font-semibold' : 'text-[#8A6A55]'}`}>
              {seoTitleWatch.length}/160 chars {seoTitleWatch.length > 70 && '(>70 chars may truncate in search previews)'}
            </span>
          </div>
          <input {...register('seoTitle')} className={fieldClass(!!errors.seoTitle)} placeholder="Noorani Moonstone Lilac Silk Suit | Aafreen Couture" />
          {errors.seoTitle && <p className={errorClass}>{errors.seoTitle.message}</p>}
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className={labelClass}>Meta Description</label>
            <span className={`text-[10px] ${seoDescWatch.length > 160 ? 'text-[#C9A86A] font-semibold' : 'text-[#8A6A55]'}`}>
              {seoDescWatch.length}/500 chars {seoDescWatch.length > 160 && '(>160 chars may truncate in search previews)'}
            </span>
          </div>
          <textarea {...register('seoDescription')} rows={2} className={fieldClass(!!errors.seoDescription)} placeholder="Discover handcrafted pure silk unstitched suit with schiffli cutwork lace and zardozi by Aafreen Couture…" />
          {errors.seoDescription && <p className={errorClass}>{errors.seoDescription.message}</p>}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="bg-[#C9A86A] hover:bg-[#B58E52] text-white text-xs font-semibold tracking-[0.2em] uppercase px-8 py-2.5 transition-colors disabled:opacity-50 rounded-lg shadow-xs cursor-pointer"
        >
          {saving ? 'Saving Ensembles…' : isEdit ? 'Update Ensemble' : 'Create Ensemble'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="text-xs uppercase tracking-wider text-[#8A6A55] hover:text-[#2E221C] transition-colors cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
