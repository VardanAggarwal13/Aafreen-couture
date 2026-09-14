import { Schema, model, models, type Document } from 'mongoose';

export interface ICmsPage extends Document {
  slug: string;
  title: string;
  route: string;
  heroBadge?: string;
  heroTitle: string;
  heroItalicTitle?: string;
  heroSubtitle: string;
  heroMetaInfo?: string;
  status: 'published' | 'draft';
  createdAt: Date;
  updatedAt: Date;
}

const CmsPageSchema = new Schema<ICmsPage>(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    title: { type: String, required: true, trim: true },
    route: { type: String, required: true, trim: true },
    heroBadge: { type: String },
    heroTitle: { type: String, required: true },
    heroItalicTitle: { type: String },
    heroSubtitle: { type: String, required: true },
    heroMetaInfo: { type: String },
    status: { type: String, enum: ['published', 'draft'], default: 'published' },
  },
  { timestamps: true }
);

const CmsPage = models.CmsPage ?? model<ICmsPage>('CmsPage', CmsPageSchema);
export default CmsPage;
