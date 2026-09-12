export default function ShopLoading() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] animate-in fade-in duration-150">
      {/* Editorial Header Skeleton */}
      <div className="w-full bg-[#FAF5EE] border-b border-[#E8D4BE]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-8 lg:py-10 text-center">
          {/* Breadcrumb shimmer */}
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="h-2.5 w-12 bg-[#E8D8C8]/60 rounded-xs animate-pulse" />
            <span className="text-[#C49A5A] text-xs">/</span>
            <div className="h-2.5 w-20 bg-[#E8D8C8]/80 rounded-xs animate-pulse" />
          </div>

          {/* Title shimmer */}
          <div className="h-8 sm:h-10 w-48 sm:w-64 bg-[#E8D8C8]/70 rounded-xs mx-auto animate-pulse my-2" />

          {/* Royal ornament */}
          <div className="flex items-center justify-center gap-2.5 my-2">
            <div className="h-px w-8 bg-gradient-to-r from-[#C49A5A]/50 to-transparent" />
            <span className="text-[#C49A5A] text-xs">✦</span>
            <div className="h-px w-8 bg-gradient-to-l from-[#C49A5A]/50 to-transparent" />
          </div>

          {/* Subtitle shimmer */}
          <div className="h-3 w-72 sm:w-96 bg-[#E8D8C8]/50 rounded-xs mx-auto animate-pulse mt-2" />
        </div>
      </div>

      {/* Filter Bar Skeleton */}
      <div className="sticky top-[72px] sm:top-[76px] lg:top-[84px] z-30 bg-white/95 backdrop-blur-md border-b border-[#E8D8C8] shadow-2xs">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-2.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="h-6 w-16 bg-[#F0E4D4] rounded-full animate-pulse" />
            <div className="h-6 w-20 bg-[#F0E4D4] rounded-full animate-pulse" />
            <div className="h-6 w-16 bg-[#F0E4D4] rounded-full animate-pulse" />
          </div>
          <div className="h-6 w-28 bg-[#F0E4D4] rounded-full animate-pulse" />
        </div>
      </div>

      {/* Product Grid Skeleton */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5 lg:gap-7">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="flex flex-col gap-3">
              <div className="aspect-[4/5] bg-white border border-[#E8D8C8] rounded-xs relative overflow-hidden shadow-2xs">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FAF5EE]/70 to-transparent animate-pulse" />
              </div>
              <div className="space-y-1.5 px-0.5">
                <div className="h-3 bg-[#E8D8C8]/70 rounded-xs animate-pulse w-3/4" />
                <div className="h-2.5 bg-[#E8D8C8]/50 rounded-xs animate-pulse w-1/2" />
                <div className="h-3 bg-[#C49A5A]/40 rounded-xs animate-pulse w-1/3 pt-1" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
