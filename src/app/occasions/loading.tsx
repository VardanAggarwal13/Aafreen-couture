export default function OccasionsLoading() {
  return (
    <main className="min-h-screen bg-[#FAF7F2] animate-in fade-in duration-150">
      {/* Top Breadcrumb Bar */}
      <div className="w-full bg-[#FAF7F2] border-b border-[#E8D8C8]/70">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center gap-2">
          <div className="h-2.5 w-10 bg-[#E8D8C8]/60 rounded-xs animate-pulse" />
          <span className="text-[#C49A5A] text-xs">/</span>
          <div className="h-2.5 w-16 bg-[#E8D8C8]/80 rounded-xs animate-pulse" />
        </div>
      </div>

      {/* Hero Banner Skeleton */}
      <div className="relative w-full bg-[#1C1415] py-14 sm:py-20 lg:py-24 text-center px-4 overflow-hidden border-b border-[#C49A5A]/30">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="h-4 w-36 bg-[#C49A5A]/30 rounded-full mx-auto animate-pulse" />
          <div className="h-10 sm:h-14 w-72 sm:w-96 bg-white/20 rounded-xs mx-auto animate-pulse" />
          <div className="h-3.5 w-80 sm:w-full max-w-xl bg-white/10 rounded-xs mx-auto animate-pulse" />
          <div className="flex items-center justify-center gap-3 pt-3">
            <div className="h-9 w-32 bg-[#C49A5A]/40 rounded-xs animate-pulse" />
            <div className="h-9 w-36 bg-white/10 rounded-xs animate-pulse" />
          </div>
        </div>
      </div>

      {/* Ceremonies Grid Skeleton */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12">
        <div className="space-y-2 text-center max-w-xl mx-auto">
          <div className="h-3 w-28 bg-[#C49A5A]/50 rounded-xs mx-auto animate-pulse" />
          <div className="h-7 w-64 bg-[#E8D8C8]/80 rounded-xs mx-auto animate-pulse" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="flex flex-col gap-3">
              <div className="aspect-[3/4] bg-white border border-[#E8D8C8] rounded-xs relative overflow-hidden shadow-2xs">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FAF5EE]/70 to-transparent animate-pulse" />
              </div>
              <div className="h-3 bg-[#E8D8C8]/70 rounded-xs animate-pulse w-3/4" />
              <div className="h-2.5 bg-[#E8D8C8]/50 rounded-xs animate-pulse w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
