import { notFound } from 'next/navigation';
import { cmsRepository } from '@/server/repositories/cms.repository';
import { CmsPageForm } from '@/features/admin/components/CmsPageForm';

export const metadata = { title: 'Edit CMS Page | Admin' };

interface Props { params: Promise<{ id: string }> }

export default async function EditCmsPagePage({ params }: Props) {
  const { id } = await params;
  const page = await cmsRepository.findById(id);
  if (!page) notFound();

  const serialized = JSON.parse(JSON.stringify(page));

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-serif text-[#2E221C] tracking-tight">Edit CMS Page</h1>
        <p className="text-sm text-[#8A6A55] mt-1 font-sans">{page.title}</p>
      </div>
      <CmsPageForm page={serialized} />
    </div>
  );
}
