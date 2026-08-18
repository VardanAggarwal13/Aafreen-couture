import Link from 'next/link';
import { Plus } from 'lucide-react';
import { productRepository } from '@/server/repositories/product.repository';
import { formatPrice } from '@/utils/format';
import { ROUTES } from '@/constants/routes';

export const metadata = { title: 'Products | Admin' };

export default async function AdminProductsPage() {
  const { items: products } = await productRepository.findMany({}, { page: 1, limit: 50 });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">Products</h1>
          <p className="text-xs text-white/40 mt-0.5">{products.length} total products</p>
        </div>
        <Link
          href={ROUTES.ADMIN_PRODUCT_NEW}
          className="flex items-center gap-2 bg-brand-gold text-white text-xs font-medium px-4 py-2.5 hover:bg-brand-gold/90 transition-colors"
        >
          <Plus size={14} /> Add Product
        </Link>
      </div>

      {/* Search + filters */}
      <div className="flex items-center gap-3">
        <input
          type="text"
          placeholder="Search products…"
          className="bg-[#1A1A1A] border border-white/8 rounded-sm px-3 py-2 text-xs text-white/70 placeholder:text-white/25 outline-none focus:border-brand-gold/50 w-64 transition-colors"
        />
        <select className="bg-[#1A1A1A] border border-white/8 rounded-sm px-3 py-2 text-xs text-white/50 outline-none">
          <option value="">All Categories</option>
          <option value="lehenga">Lehenga</option>
          <option value="suits">Suits</option>
          <option value="dresses">Dresses</option>
          <option value="accessories">Accessories</option>
        </select>
        <select className="bg-[#1A1A1A] border border-white/8 rounded-sm px-3 py-2 text-xs text-white/50 outline-none">
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-[#1A1A1A] border border-white/5 rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/5">
                {['Product', 'Category', 'Price', 'Stock', 'Status', 'Action'].map((h) => (
                  <th key={h} className="text-left px-4 py-3.5 text-[10px] font-semibold text-white/30 uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-white/25">
                    No products yet. <Link href={ROUTES.ADMIN_PRODUCT_NEW} className="text-brand-gold hover:underline">Add your first product →</Link>
                  </td>
                </tr>
              ) : (
                products.map((product) => {
                  const stock = product.variants?.reduce((s, v) => s + v.stock, 0) ?? 0;
                  return (
                    <tr key={String(product._id)} className="hover:bg-white/2 transition-colors group">
                      <td className="px-4 py-3.5 max-w-[200px]">
                        <p className="font-medium text-white truncate">{product.name}</p>
                        <p className="text-white/30 text-[10px] mt-0.5">{product.slug}</p>
                      </td>
                      <td className="px-4 py-3.5 text-white/50 capitalize">
                        {typeof product.category === 'object' && product.category !== null
                          ? (product.category as { name?: string }).name ?? '—'
                          : '—'}
                      </td>
                      <td className="px-4 py-3.5 text-white font-medium">{formatPrice(product.basePrice)}</td>
                      <td className="px-4 py-3.5">
                        <span className={stock === 0 ? 'text-red-400' : stock < 5 ? 'text-yellow-400' : 'text-white/70'}>
                          {stock}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full font-medium ${product.isActive ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400'}`}>
                          {product.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link
                            href={ROUTES.ADMIN_PRODUCT(String(product._id))}
                            className="text-brand-gold hover:underline"
                          >
                            Edit
                          </Link>
                          <Link
                            href={ROUTES.PRODUCT(product.slug)}
                            target="_blank"
                            className="text-white/40 hover:text-white"
                          >
                            View
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
