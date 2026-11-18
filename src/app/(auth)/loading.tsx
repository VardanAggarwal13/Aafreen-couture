import { LoadingState } from '@/components/common/LoadingState';
import { Skeleton } from '@/components/ui/skeleton';
import { AUTH_WRAP, AUTH_CARD, AUTH_PANEL, AUTH_FORM_WIDTH } from './auth-styles';

/** Sign-in / register loading screen: same full-width split as the real page (brand panel + form). */
export default function AuthLoading() {
  return (
    <LoadingState label="Loading sign in" className={AUTH_WRAP}>
      <div className={AUTH_CARD}>
        <div className="hidden lg:flex lg:col-span-5 flex-col items-center justify-center gap-5 border-r border-border bg-[#F5EFE6] p-8 xl:p-12">
          <Skeleton className="h-24 w-60 xl:w-72" />
          <Skeleton className="h-px w-14" />
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-8 w-64" />
          <div className="space-y-3 pt-2">
            <Skeleton className="h-3.5 w-64" />
            <Skeleton className="h-3.5 w-56" />
            <Skeleton className="h-3.5 w-60" />
          </div>
        </div>

        <div className={AUTH_PANEL}>
          <div className={`${AUTH_FORM_WIDTH} space-y-5`}>
            <Skeleton className="h-10 w-64 rounded-full" />
            <Skeleton className="h-8 w-52" />
            <Skeleton className="h-3.5 w-72 max-w-full" />
            <div className="space-y-4 pt-2">
              {Array.from({ length: 2 }, (_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-11 w-full rounded-xl" />
                </div>
              ))}
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
            <Skeleton className="h-11 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </LoadingState>
  );
}
