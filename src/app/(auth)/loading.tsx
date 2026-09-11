export default function AuthLoading() {
  return (
    <div className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12 animate-pulse">
      <div className="w-full max-w-5xl bg-surface border border-border shadow-lg rounded-xs overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[620px]">
        {/* Left Side Skeleton */}
        <div className="lg:col-span-5 hidden lg:flex flex-col justify-between p-8 xl:p-10 bg-background/80 border-r border-border">
          <div className="h-6 w-32 bg-border/60 rounded-xs" />
          <div className="space-y-4 my-auto py-6">
            <div className="h-8 w-3/4 bg-border/80 rounded-xs" />
            <div className="h-4 w-full bg-border/40 rounded-xs" />
            <div className="h-4 w-5/6 bg-border/40 rounded-xs" />
            <div className="pt-4 space-y-3">
              <div className="h-4 w-2/3 bg-border/50 rounded-xs" />
              <div className="h-4 w-3/4 bg-border/50 rounded-xs" />
              <div className="h-4 w-1/2 bg-border/50 rounded-xs" />
            </div>
          </div>
          <div className="h-4 w-40 bg-gold/30 rounded-xs" />
        </div>

        {/* Right Side Skeleton */}
        <div className="lg:col-span-7 p-6 sm:p-10 xl:p-12 flex flex-col justify-center bg-surface">
          <div className="max-w-md w-full mx-auto space-y-5">
            <div className="flex gap-8 border-b border-border/80 pb-3">
              <div className="h-6 w-24 bg-border/80 rounded-xs" />
              <div className="h-6 w-28 bg-border/40 rounded-xs" />
            </div>
            <div className="h-3.5 w-64 bg-border/40 rounded-xs" />
            <div className="space-y-4 pt-2">
              <div>
                <div className="h-3 w-20 bg-border/70 rounded-xs mb-2" />
                <div className="h-10 w-full bg-background border border-border rounded-xs" />
              </div>
              <div>
                <div className="h-3 w-20 bg-border/70 rounded-xs mb-2" />
                <div className="h-10 w-full bg-background border border-border rounded-xs" />
              </div>
              <div className="h-11 w-full bg-heading/70 rounded-xs mt-4" />
            </div>
            <div className="h-10 w-full bg-background border border-border rounded-xs" />
          </div>
        </div>
      </div>
    </div>
  );
}
