import type { Metadata } from 'next';
import { productRepository } from '@/server/repositories/product.repository';

export const metadata: Metadata = { title: 'Inventory | Admin' };

export default async function AdminInventoryPage() {
  const { items } = await productRepository.findMany({ isActive: undefined }, { limit: 100 });
  const products = JSON.parse(JSON.stringify(items));

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-xl font-serif text-white">Inventory</h1>
        <p className="text-sm text-white/50 mt-0.5">Stock levels across all products</p>
      </div>

      <div className="bg-[#1A1A1A] border border-white/5 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5 text-white/40 text-xs uppercase tracking-wider">
              <th className="text-left px-6 py-3.5 font-medium">Product</th>
              <th className="text-left px-6 py-3.5 font-medium hidden sm:table-cell">SKU / Variant</th>
              <th className="text-left px-6 py-3.5 font-medium">Stock</th>
              <th className="text-left px-6 py-3.5 font-medium hidden md:table-cell">Price</th>
              <th className="text-left px-6 py-3.5 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p: Record<string, unknown>) => {
              const variants = (p.variants as Array<{ size?: string; color?: string; stock: number; price: number; sku?: string }>) ?? [];
              if (variants.length === 0) {
                return (
                  <tr key={p._id as string} className="border-b border-white/5">
                    <td className="px-6 py-4 text-white">{p.name as string}</td>
                    <td className="px-6 py-4 text-white/40 hidden sm:table-cell">—</td>
                    <td className="px-6 py-4 text-white/60">—</td>
                    <td className="px-6 py-4 text-white/60 hidden md:table-cell">
                      ₹{((p.price as number) / 100).toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 ${p.isActive ? 'bg-emerald-500/15 text-emerald-400' : 'bg-white/10 text-white/40'}`}>
                        {p.isActive ? 'Active' : 'Draft'}
                      </span>
                    </td>
                  </tr>
                );
              }
              return variants.map((v, i) => (
                <tr key={`${p._id as string}-${i}`} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                  {i === 0 && (
                    <td className="px-6 py-4 text-white" rowSpan={variants.length}>
                      {p.name as string}
                    </td>
                  )}
                  <td className="px-6 py-4 text-white/60 hidden sm:table-cell text-xs">
                    {v.sku ?? (`${v.size ?? ''} / ${v.color ?? ''}`.replace('/ ', '').replace(' /', '') || '—')}
                  </td>
                  <td className={`px-6 py-4 font-semibold ${v.stock <= 5 ? 'text-amber-400' : 'text-white/60'}`}>
                    {v.stock}
                    {v.stock === 0 && <span className="ml-1 text-xs text-red-400">(Out)</span>}
                    {v.stock > 0 && v.stock <= 5 && <span className="ml-1 text-xs text-amber-400">(Low)</span>}
                  </td>
                  <td className="px-6 py-4 text-white/60 hidden md:table-cell">
                    ₹{(v.price / 100).toLocaleString('en-IN')}
                  </td>
                  {i === 0 && (
                    <td className="px-6 py-4" rowSpan={variants.length}>
                      <span className={`text-[11px] font-semibold px-2 py-0.5 ${p.isActive ? 'bg-emerald-500/15 text-emerald-400' : 'bg-white/10 text-white/40'}`}>
                        {p.isActive ? 'Active' : 'Draft'}
                      </span>
                    </td>
                  )}
                </tr>
              ));
            })}
            {products.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-white/30">No products found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
