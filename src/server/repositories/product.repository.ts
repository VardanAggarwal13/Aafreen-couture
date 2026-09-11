import { connectDB } from '@/lib/db';
import mongoose from 'mongoose';
import Product from '@/models/Product';
import Category from '@/models/Category';
import Collection from '@/models/Collection';
import type { IProduct } from '@/models/Product';
import type { PaginationParams } from '@/types';
import type { SortOrder } from 'mongoose';
import { FALLBACK_PRODUCTS } from '@/data/products.data';

export interface ProductFilters {
  ids?: string[];
  category?: string;
  collectionRef?: string;
  occasion?: string;
  color?: string;
  size?: string;
  fabric?: string;
  minPrice?: number;
  maxPrice?: number;
  tags?: string[];
  isActive?: boolean;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  search?: string;
  sort?: 'newest' | 'price-asc' | 'price-desc' | 'popular' | 'rating';
}

function matchFallbackFilters(p: IProduct, filters: ProductFilters): boolean {
  if (filters.ids && filters.ids.length > 0) {
    const idStr = String(p._id);
    if (!filters.ids.includes(idStr) && !filters.ids.includes(p.slug)) return false;
  }
  if (filters.isActive !== undefined && p.isActive !== filters.isActive) return false;
  if (filters.isFeatured !== undefined && p.isFeatured !== filters.isFeatured) return false;
  if (filters.isNewArrival !== undefined && p.isNewArrival !== filters.isNewArrival) return false;
  if (filters.isBestSeller !== undefined && p.isBestSeller !== filters.isBestSeller) return false;

  if (filters.occasion) {
    const occ = filters.occasion.toLowerCase();
    const matchesOcc = p.occasion?.some((o) => {
      const ol = o.toLowerCase().replace(/\s+/g, '-');
      return ol === occ || o.toLowerCase() === occ || ol.includes(occ);
    });
    if (!matchesOcc) return false;
  }

  if (filters.category) {
    const catSlug = (typeof p.category === 'object' && p.category ? (p.category as { slug?: string }).slug?.toLowerCase() : String(p.category).toLowerCase()) ?? '';
    const colSlug = (typeof p.collection === 'object' && p.collection ? (p.collection as unknown as { slug?: string }).slug?.toLowerCase() : String(p.collection).toLowerCase()) ?? '';
    const reqCat = filters.category.toLowerCase();

    if (reqCat === 'bridal-lehengas' || reqCat === 'bridal-lehenga') {
      // STRICT: Only pure Bridal Lehengas (No Haldi, No Gowns, No Suits)
      if (catSlug !== 'bridal-lehengas') return false;
      const isHaldi = colSlug === 'haldi-collection' || p.tags?.includes('haldi');
      const isGown = colSlug === 'reception-gowns' || p.tags?.includes('gown');
      if (isHaldi || isGown) return false;
      return true;
    } else if (reqCat === 'reception-gowns' || reqCat === 'gowns') {
      // STRICT: Only Reception Gowns
      const isGown = catSlug === 'gowns' || catSlug === 'reception-gowns' || colSlug === 'reception-gowns';
      if (!isGown) return false;
      return true;
    } else if (reqCat === 'bridal') {
      // Entire Bridal category: includes bridal-lehengas, bridal-suits, bridesmaid-lehengas, reception-gowns
      const isBridalSub = catSlug === 'bridal-lehengas' ||
        catSlug === 'bridal-suits' ||
        catSlug === 'bridesmaid-lehengas' ||
        catSlug === 'reception-gowns' ||
        catSlug === 'gowns';
      const isHaldi = catSlug === 'haldi' || colSlug === 'haldi-collection';
      if (isHaldi) return false;
      if (!isBridalSub) return false;
      return true;
    } else if (reqCat === 'bridal-suits') {
      const isSuit = catSlug === 'bridal-suits' || (catSlug === 'suits' && (p.tags?.includes('bridal') || p.tags?.includes('bridal-suits')));
      if (!isSuit) return false;
      return true;
    } else if (reqCat === 'bridesmaid-lehengas') {
      const isBridesmaid = catSlug === 'bridesmaid-lehengas';
      if (!isBridesmaid) return false;
      return true;
    } else if (reqCat === 'haldi' || reqCat === 'haldi-collection' || reqCat === 'haldi-lehengas') {
      // STRICT: Only Haldi Collection
      const isHaldi = catSlug === 'haldi' || colSlug === 'haldi-collection' || p.tags?.includes('haldi');
      if (!isHaldi) return false;
      return true;
    } else if (catSlug === reqCat) {
      // direct match for other categories
      return true;
    } else if (reqCat === 'cotton-kurta-sets') {
      const isCottonKurta = (catSlug === 'suits' || catSlug === 'co-ord-sets' || catSlug === 'cotton-kurta-sets') &&
        (p.fabric?.toLowerCase().includes('cotton') || p.tags?.includes('cotton') || p.name.toLowerCase().includes('kurta') || p.name.toLowerCase().includes('anarkali') || p.fabric?.toLowerCase().includes('chanderi'));
      if (!isCottonKurta) return false;
    } else if (reqCat === 'co-ord-sets' || reqCat === 'signature-co-ords') {
      const isCoord = catSlug === 'co-ord-sets' || p.tags?.includes('coord') || p.name.toLowerCase().includes('coord');
      if (!isCoord) return false;
    } else if (reqCat === 'new-arrivals') {
      const isNew = p.isNewArrival || p.tags?.includes('new') || p.tags?.includes('new-arrival') || true;
      if (!isNew) return false;
    } else if (reqCat === 'summer-essentials') {
      const isSummer = catSlug === 'suits' || p.fabric?.toLowerCase().includes('cotton') || p.tags?.includes('summer') || p.name.toLowerCase().includes('anarkali') || p.fabric?.toLowerCase().includes('chanderi');
      if (!isSummer) return false;
    } else if (reqCat === 'partywear-unstitched') {
      const isPartywear = catSlug === 'suits' || p.tags?.includes('partywear') || p.tags?.includes('unstitched') || p.name.toLowerCase().includes('sharara') || p.name.toLowerCase().includes('anarkali');
      if (!isPartywear) return false;
    } else if (reqCat === 'custom-embroidered-suits' || reqCat === 'handcrafted-luxury') {
      const isEmb = catSlug === 'suits' || p.tags?.includes('embroidered') || p.name.toLowerCase().includes('anarkali') || p.name.toLowerCase().includes('sharara');
      if (!isEmb) return false;
    } else if (reqCat === 'indo-western') {
      const isIndo = catSlug === 'co-ord-sets' || catSlug === 'indo-western' || p.tags?.includes('indo-western') || p.name.toLowerCase().includes('coord');
      if (!isIndo) return false;
    } else if (reqCat === 'dresses') {
      const isDress = catSlug === 'gowns' || p.name.toLowerCase().includes('gown') || p.tags?.includes('dress') || p.tags?.includes('gown');
      if (!isDress) return false;
    } else if (reqCat === 'sharara' || reqCat === 'sharara-sets') {
      const isSharara = p.name.toLowerCase().includes('sharara') || p.tags?.includes('sharara') || p.description.toLowerCase().includes('sharara');
      if (!isSharara) return false;
    } else if (reqCat === 'occasion-lehengas') {
      const isLehenga = catSlug === 'bridal-lehengas' || catSlug === 'bridesmaid-lehengas' || p.name.toLowerCase().includes('lehenga');
      if (!isLehenga) return false;
    } else if (reqCat === 'handbags' || reqCat === 'the-bag-edit') {
      const isBag = catSlug === 'the-bag-edit' || p.tags?.includes('bag') || p.name.toLowerCase().includes('bag') || p.name.toLowerCase().includes('potli');
      if (!isBag) return false;
    } else if (reqCat === 'potlis') {
      const isPotli = catSlug === 'the-bag-edit' || p.name.toLowerCase().includes('potli') || p.tags?.includes('potli');
      if (!isPotli) return false;
    } else if (reqCat === 'clutches') {
      const isClutch = catSlug === 'the-bag-edit' || p.name.toLowerCase().includes('clutch') || p.tags?.includes('clutch');
      if (!isClutch) return false;
    } else if (reqCat === 'totes') {
      const isTote = catSlug === 'the-bag-edit' || p.name.toLowerCase().includes('tote') || p.tags?.includes('tote');
      if (!isTote) return false;
    } else if (reqCat === 'shoulder-bags') {
      const isShoulder = catSlug === 'the-bag-edit' || p.name.toLowerCase().includes('shoulder') || p.tags?.includes('bag');
      if (!isShoulder) return false;
    } else if (reqCat === 'jewellery') {
      const isJewel = catSlug === 'jewellery' || p.tags?.includes('jewellery') || p.name.toLowerCase().includes('choker') || p.name.toLowerCase().includes('jewellery');
      if (!isJewel) return false;
    } else if (reqCat === 'suits') {
      const isSuit = catSlug === 'suits' || p.name.toLowerCase().includes('suit') || p.name.toLowerCase().includes('anarkali') || p.name.toLowerCase().includes('sharara');
      if (!isSuit) return false;
    } else {
      const matchesOcc = p.occasion?.some((o) => {
        const ol = o.toLowerCase().replace(/\s+/g, '-');
        return ol === reqCat || o.toLowerCase() === reqCat;
      });
      if (!matchesOcc) return false;
    }
  }

  if (filters.collectionRef) {
    const rawCol = (p as { collectionRef?: unknown; collection?: unknown }).collectionRef
      ?? (p as { collection?: unknown }).collection;
    const colId = typeof rawCol === 'object' && rawCol && '_id' in rawCol ? String((rawCol as { _id: unknown })._id) : undefined;
    const colSlug = typeof rawCol === 'object' && rawCol && 'slug' in rawCol ? String((rawCol as { slug?: string }).slug) : String(rawCol ?? '');
    const isBridalCol = (filters.collectionRef === 'bridal' || filters.collectionRef === 'col-bridal') &&
      (colSlug === 'bridal-lehengas-suits' || colSlug === 'bridal' || colId === 'col-bridal-lehengas-suits' || colId === 'col-bridal');
    const isReceptionCol = (filters.collectionRef === 'reception' || filters.collectionRef === 'col-reception') &&
      (colSlug === 'reception-gowns' || colSlug === 'reception' || p.occasion?.some((o) => o.toLowerCase() === 'reception'));
    const matchesCol = filters.collectionRef === colId || filters.collectionRef === colSlug || isBridalCol || isReceptionCol;
    if (!matchesCol) return false;
  }

  if (filters.minPrice !== undefined && p.basePrice < filters.minPrice) return false;
  if (filters.maxPrice !== undefined && p.basePrice > filters.maxPrice) return false;

  if (filters.color) {
    const c = filters.color.toLowerCase();
    const matchesColor =
      p.name.toLowerCase().includes(c) ||
      p.description.toLowerCase().includes(c) ||
      p.tags?.some((t) => t.toLowerCase().includes(c));
    if (!matchesColor) return false;
  }

  if (filters.fabric) {
    const f = filters.fabric.toLowerCase();
    const matchesFabric = p.fabric?.toLowerCase().includes(f);
    if (!matchesFabric) return false;
  }

  if (filters.tags?.length) {
    const hasTag = filters.tags.some((t) => p.tags.includes(t));
    if (!hasTag) return false;
  }

  if (filters.search) {
    const s = filters.search.toLowerCase();
    const match =
      p.name.toLowerCase().includes(s) ||
      p.description.toLowerCase().includes(s) ||
      p.tags.some((t) => t.toLowerCase().includes(s));
    if (!match) return false;
  }

  return true;
}

// High-performance in-memory cache with TTL (120s)
interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

const DEFAULT_TTL_MS = 120 * 1000; // 2 minutes
const memoryQueryCache = new Map<string, CacheEntry<unknown>>();
const categorySlugCache = new Map<string, mongoose.Types.ObjectId | null>();
const collectionSlugCache = new Map<string, mongoose.Types.ObjectId | null>();

function getFromCache<T>(key: string): T | null {
  const entry = memoryQueryCache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    memoryQueryCache.delete(key);
    return null;
  }
  return entry.data as T;
}

function setToCache<T>(key: string, data: T, ttl = DEFAULT_TTL_MS): void {
  // Guard max cache size to prevent memory leaks
  if (memoryQueryCache.size > 2000) {
    memoryQueryCache.clear();
  }
  memoryQueryCache.set(key, {
    data,
    expiresAt: Date.now() + ttl,
  });
}

export class ProductRepository {
  clearCache(): void {
    memoryQueryCache.clear();
    categorySlugCache.clear();
    collectionSlugCache.clear();
  }

  async findById(id: string): Promise<IProduct | null> {
    const cacheKey = `id:${id}`;
    const cached = getFromCache<IProduct>(cacheKey);
    if (cached) return cached;

    try {
      await connectDB();
      const query = mongoose.isValidObjectId(id)
        ? { _id: id }
        : { slug: id };
      const doc = await Product.findOne(query).populate('category', 'name slug').lean<IProduct>();
      if (doc) {
        setToCache(cacheKey, doc);
        return doc;
      }
    } catch {
      // Fallback below
    }
    const found = FALLBACK_PRODUCTS.find((p) => p._id === id || String(p._id) === id || p.slug === id);
    const result = (found as unknown as IProduct) ?? null;
    if (result) setToCache(cacheKey, result);
    return result;
  }

  async findBySlug(slug: string): Promise<IProduct | null> {
    const cacheKey = `slug:${slug}`;
    const cached = getFromCache<IProduct>(cacheKey);
    if (cached) return cached;

    try {
      await connectDB();
      const doc = await Product.findOne({ slug, isActive: true })
        .populate('category', 'name slug')
        .lean<IProduct>();
      if (doc) {
        setToCache(cacheKey, doc);
        return doc;
      }
    } catch {
      // Fallback below
    }
    const found = FALLBACK_PRODUCTS.find((p) => p.slug === slug);
    const result = (found as unknown as IProduct) ?? null;
    if (result) setToCache(cacheKey, result);
    return result;
  }

  async findMany(
    filters: ProductFilters,
    pagination: PaginationParams
  ): Promise<{ items: IProduct[]; total: number }> {
    const cacheKey = `findMany:${JSON.stringify(filters)}:${JSON.stringify(pagination)}`;
    const cached = getFromCache<{ items: IProduct[]; total: number }>(cacheKey);
    if (cached) return cached;

    try {
      await connectDB();

      const query: Record<string, unknown> = { isActive: true };

      if (filters.ids && filters.ids.length > 0) {
        const validObjectIds = filters.ids
          .filter((id) => mongoose.Types.ObjectId.isValid(id))
          .map((id) => new mongoose.Types.ObjectId(id));
        query.$or = [
          { _id: { $in: validObjectIds } },
          { slug: { $in: filters.ids } },
        ];
      }

      if (filters.category) {
        if (mongoose.Types.ObjectId.isValid(filters.category)) {
          query.category = filters.category;
        } else {
          const slugKey = filters.category.toLowerCase();
          let catId = categorySlugCache.get(slugKey);
          if (catId === undefined) {
            const cat = await Category.findOne({ slug: slugKey }).lean();
            catId = cat ? (cat._id as mongoose.Types.ObjectId) : null;
            categorySlugCache.set(slugKey, catId);
          }

          if (catId) {
            query.category = catId;
          } else {
            query.$or = [
              { tags: filters.category.toLowerCase() },
              { occasion: { $regex: new RegExp(`^${filters.category}$`, 'i') } },
              { fabric: { $regex: new RegExp(`^${filters.category}$`, 'i') } },
              { name: { $regex: new RegExp(filters.category.replace(/-/g, ' '), 'i') } },
            ];
          }
        }
      }
      if (filters.collectionRef) {
        if (mongoose.Types.ObjectId.isValid(filters.collectionRef)) {
          query.collectionRef = filters.collectionRef;
        } else {
          const colSlugKey = filters.collectionRef.toLowerCase();
          let colId = collectionSlugCache.get(colSlugKey);
          if (colId === undefined) {
            const col = await Collection.findOne({ slug: colSlugKey }).lean();
            colId = col ? (col._id as mongoose.Types.ObjectId) : null;
            collectionSlugCache.set(colSlugKey, colId);
          }
          if (colId) {
            query.collectionRef = colId;
          }
        }
      }
      if (filters.occasion) query.occasion = { $regex: new RegExp(`^${filters.occasion}$`, 'i') };
      if (filters.isFeatured !== undefined) query.isFeatured = filters.isFeatured;
      if (filters.isNewArrival !== undefined) query.isNewArrival = filters.isNewArrival;
      if (filters.isBestSeller !== undefined) query.isBestSeller = filters.isBestSeller;
      if (filters.tags?.length) query.tags = { $in: filters.tags };
      if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
        query.basePrice = {};
        if (filters.minPrice !== undefined) (query.basePrice as Record<string, number>).$gte = filters.minPrice;
        if (filters.maxPrice !== undefined) (query.basePrice as Record<string, number>).$lte = filters.maxPrice;
      }
      if (filters.search) {
        query.$text = { $search: filters.search };
      }

      const sortMap: Record<string, Record<string, SortOrder>> = {
        newest: { createdAt: -1 },
        'price-asc': { basePrice: 1 },
        'price-desc': { basePrice: -1 },
        popular: { soldCount: -1 },
        rating: { averageRating: -1 },
      };
      const sort = sortMap[filters.sort ?? 'newest'] ?? { createdAt: -1 as SortOrder };

      const { page = 1, limit = 24 } = pagination;
      const skip = (page - 1) * limit;

      const [items, total] = await Promise.all([
        Product.find(query)
          .sort(sort)
          .skip(skip)
          .limit(limit)
          .populate('category', 'name slug')
          .lean<IProduct[]>(),
        Product.countDocuments(query),
      ]);

      if (items.length > 0) {
        const result = { items, total };
        setToCache(cacheKey, result);
        return result;
      }
    } catch {
      // Fallback below
    }

    // Filter fallback products
    const list = (FALLBACK_PRODUCTS as unknown as IProduct[]).filter((p) =>
      matchFallbackFilters(p, filters)
    );

    // Sort fallback
    if (filters.sort === 'price-asc') {
      list.sort((a, b) => a.basePrice - b.basePrice);
    } else if (filters.sort === 'price-desc') {
      list.sort((a, b) => b.basePrice - a.basePrice);
    } else if (filters.sort === 'popular') {
      list.sort((a, b) => (b.soldCount ?? 0) - (a.soldCount ?? 0));
    } else if (filters.sort === 'rating') {
      list.sort((a, b) => (b.averageRating ?? 0) - (a.averageRating ?? 0));
    } else {
      list.sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime());
    }

    const { page = 1, limit = 24 } = pagination;
    const skip = (page - 1) * limit;
    const items = list.slice(skip, skip + limit);
    const result = { items, total: list.length };
    setToCache(cacheKey, result);
    return result;
  }

  async findFeatured(limit = 8): Promise<IProduct[]> {
    const cacheKey = `featured:${limit}`;
    const cached = getFromCache<IProduct[]>(cacheKey);
    if (cached) return cached;

    try {
      await connectDB();
      const docs = await Product.find({ isActive: true, isFeatured: true })
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate('category', 'name slug')
        .lean<IProduct[]>();
      if (docs.length > 0) {
        setToCache(cacheKey, docs);
        return docs;
      }
    } catch {
      // Fallback below
    }
    const result = (FALLBACK_PRODUCTS as unknown as IProduct[])
      .filter((p) => p.isFeatured && p.isActive)
      .slice(0, limit);
    setToCache(cacheKey, result);
    return result;
  }

  async findNewArrivals(limit = 8): Promise<IProduct[]> {
    const cacheKey = `newArrivals:${limit}`;
    const cached = getFromCache<IProduct[]>(cacheKey);
    if (cached) return cached;

    try {
      await connectDB();
      const docs = await Product.find({ isActive: true, isNewArrival: true })
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate('category', 'name slug')
        .lean<IProduct[]>();
      if (docs.length > 0) {
        setToCache(cacheKey, docs);
        return docs;
      }
    } catch {
      // Fallback below
    }
    const result = (FALLBACK_PRODUCTS as unknown as IProduct[])
      .filter((p) => p.isNewArrival && p.isActive)
      .slice(0, limit);
    setToCache(cacheKey, result);
    return result;
  }

  async findBestSellers(limit = 8): Promise<IProduct[]> {
    const cacheKey = `bestSellers:${limit}`;
    const cached = getFromCache<IProduct[]>(cacheKey);
    if (cached) return cached;

    try {
      await connectDB();
      const docs = await Product.find({ isActive: true, isBestSeller: true })
        .sort({ soldCount: -1 })
        .limit(limit)
        .populate('category', 'name slug')
        .lean<IProduct[]>();
      if (docs.length > 0) {
        setToCache(cacheKey, docs);
        return docs;
      }
    } catch {
      // Fallback below
    }
    const result = (FALLBACK_PRODUCTS as unknown as IProduct[])
      .filter((p) => p.isBestSeller && p.isActive)
      .slice(0, limit);
    setToCache(cacheKey, result);
    return result;
  }

  async findRelated(productId: string, categoryId: string, limit = 4): Promise<IProduct[]> {
    const cacheKey = `related:${productId}:${categoryId}:${limit}`;
    const cached = getFromCache<IProduct[]>(cacheKey);
    if (cached) return cached;

    try {
      await connectDB();
      const docs = await Product.find({
        _id: { $ne: productId },
        category: categoryId,
        isActive: true,
      })
        .sort({ soldCount: -1 })
        .limit(limit)
        .populate('category', 'name slug')
        .lean<IProduct[]>();
      if (docs.length > 0) {
        setToCache(cacheKey, docs);
        return docs;
      }
    } catch {
      // Fallback below
    }
    const result = (FALLBACK_PRODUCTS as unknown as IProduct[])
      .filter((p) => String(p._id) !== String(productId))
      .slice(0, limit);
    setToCache(cacheKey, result);
    return result;
  }

  async create(data: Partial<IProduct>): Promise<IProduct> {
    this.clearCache();
    await connectDB();
    if (data.category && typeof data.category === 'string' && !mongoose.isValidObjectId(data.category)) {
      const slug = (data.category as string).toLowerCase();
      let cat = await Category.findOne({ slug });
      if (!cat) {
        cat = await Category.create({
          name: slug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
          slug,
          isActive: true,
        });
      }
      data.category = cat._id as unknown as mongoose.Types.ObjectId;
    }
    if (data.collectionRef && typeof data.collectionRef === 'string' && !mongoose.isValidObjectId(data.collectionRef)) {
      const col = await Collection.findOne({ slug: (data.collectionRef as string).toLowerCase() });
      if (col) {
        data.collectionRef = col._id as unknown as mongoose.Types.ObjectId;
      } else {
        delete data.collectionRef;
      }
    }
    if (!data.variants || data.variants.length === 0) {
      const pSlug = data.slug || 'prod';
      const pPrice = data.basePrice || 100000;
      data.variants = ['XS', 'S', 'M', 'L', 'XL'].map((sz) => ({
        size: sz,
        sku: `${pSlug}-${sz}`.toUpperCase(),
        price: pPrice,
        stock: 10,
        isActive: true,
      })) as unknown as IProduct['variants'];
    }
    const doc = await Product.create(data);
    this.clearCache();
    return doc.toObject() as IProduct;
  }

  async update(idOrSlug: string, data: Partial<IProduct>): Promise<IProduct | null> {
    this.clearCache();
    await connectDB();
    if (data.category && typeof data.category === 'string' && !mongoose.isValidObjectId(data.category)) {
      const slug = (data.category as string).toLowerCase();
      let cat = await Category.findOne({ slug });
      if (!cat) {
        cat = await Category.create({
          name: slug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
          slug,
          isActive: true,
        });
      }
      data.category = cat._id as unknown as mongoose.Types.ObjectId;
    }
    if (data.collectionRef && typeof data.collectionRef === 'string' && !mongoose.isValidObjectId(data.collectionRef)) {
      const col = await Collection.findOne({ slug: (data.collectionRef as string).toLowerCase() });
      if (col) {
        data.collectionRef = col._id as unknown as mongoose.Types.ObjectId;
      } else {
        delete data.collectionRef;
      }
    }
    const query = mongoose.isValidObjectId(idOrSlug)
      ? { _id: idOrSlug }
      : { slug: idOrSlug };
    const res = await Product.findOneAndUpdate(query, data, { new: true }).lean<IProduct>();
    this.clearCache();
    return res;
  }

  async delete(idOrSlug: string): Promise<boolean> {
    this.clearCache();
    await connectDB();
    const query = mongoose.isValidObjectId(idOrSlug)
      ? { _id: idOrSlug }
      : { slug: idOrSlug };
    const result = await Product.findOneAndDelete(query);
    this.clearCache();
    return !!result;
  }

  async decrementStock(
    productId: string,
    variantId: string | undefined,
    quantity: number
  ): Promise<boolean> {
    this.clearCache();
    try {
      await connectDB();
      const pId = mongoose.isValidObjectId(productId)
        ? new mongoose.Types.ObjectId(productId)
        : productId;

      if (variantId && mongoose.isValidObjectId(variantId)) {
        const vId = new mongoose.Types.ObjectId(variantId);
        const result = await Product.updateOne(
          { _id: pId, 'variants._id': vId },
          {
            $inc: {
              'variants.$.stock': -quantity,
              soldCount: quantity,
            },
          }
        );
        this.clearCache();
        return result.modifiedCount > 0;
      } else {
        const result = await Product.updateOne(
          { _id: pId },
          { $inc: { soldCount: quantity } }
        );
        this.clearCache();
        return result.modifiedCount > 0;
      }
    } catch (err) {
      console.error('Error decrementing product stock:', err);
      return false;
    }
  }

  async incrementStock(
    productId: string,
    variantId: string | undefined,
    quantity: number
  ): Promise<boolean> {
    this.clearCache();
    try {
      await connectDB();
      const pId = mongoose.isValidObjectId(productId)
        ? new mongoose.Types.ObjectId(productId)
        : productId;

      if (variantId && mongoose.isValidObjectId(variantId)) {
        const vId = new mongoose.Types.ObjectId(variantId);
        const result = await Product.updateOne(
          { _id: pId, 'variants._id': vId },
          {
            $inc: {
              'variants.$.stock': quantity,
              soldCount: -quantity,
            },
          }
        );
        this.clearCache();
        return result.modifiedCount > 0;
      } else {
        const result = await Product.updateOne(
          { _id: pId },
          { $inc: { soldCount: -quantity } }
        );
        this.clearCache();
        return result.modifiedCount > 0;
      }
    } catch (err) {
      console.error('Error incrementing product stock:', err);
      return false;
    }
  }
}

export const productRepository = new ProductRepository();
