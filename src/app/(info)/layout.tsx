import { InfoNavHeader } from '@/features/info/components/InfoNavHeader';

export default function InfoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <InfoNavHeader />
      <div className="flex-1">{children}</div>
    </div>
  );
}
