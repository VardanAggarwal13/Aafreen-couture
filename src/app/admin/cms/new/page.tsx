import { CmsPageForm } from '@/features/admin/components/CmsPageForm';

export const metadata = { title: 'New CMS Page | Admin' };

export default function NewCmsPagePage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-serif text-[#2E221C] tracking-tight">Create New CMS Page</h1>
        <p className="text-sm text-[#8A6A55] mt-1 font-sans">Add hero banner content for a static brand or policy page</p>
      </div>
      <CmsPageForm />
    </div>
  );
}
