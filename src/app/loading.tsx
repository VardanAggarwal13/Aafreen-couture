export default function RootLoading() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] animate-in fade-in duration-100 flex flex-col">
      {/* Top subtle golden shimmer line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#C49A5A] to-transparent animate-pulse" />

      {/* Main loading container */}
      <div className="max-w-[1440px] mx-auto w-full px-4 sm:px-6 lg:px-12 py-10 space-y-8 flex-1">
        <div className="space-y-3 text-center max-w-md mx-auto pt-6">
          <div className="h-3 w-28 bg-[#C49A5A]/40 rounded-full mx-auto animate-pulse" />
          <div className="h-8 w-60 bg-[#E8D8C8]/70 rounded-xs mx-auto animate-pulse" />
          <div className="h-3 w-80 bg-[#E8D8C8]/40 rounded-xs mx-auto animate-pulse" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 pt-6">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="aspect-[4/5] bg-white border border-[#E8D8C8] rounded-xs relative overflow-hidden shadow-2xs">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FAF5EE]/60 to-transparent animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
