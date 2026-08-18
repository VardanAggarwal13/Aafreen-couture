import { Schema, model, models, type Document } from 'mongoose';

export type BannerPosition = 'hero' | 'category' | 'popup' | 'strip';

export interface IBanner extends Document {
  title: string;
  subtitle?: string;
  image: string;
  mobileImage?: string;
  link?: string;
  position: BannerPosition;
  isActive: boolean;
  sortOrder: number;
  validFrom?: Date;
  validUntil?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const BannerSchema = new Schema<IBanner>(
  {
    title: { type: String, required: true, trim: true },
    subtitle: { type: String },
    image: { type: String, required: true },
    mobileImage: { type: String },
    link: { type: String },
    position: {
      type: String,
      enum: ['hero', 'category', 'popup', 'strip'],
      required: true,
    },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
    validFrom: { type: Date },
    validUntil: { type: Date },
  },
  { timestamps: true }
);

BannerSchema.index({ position: 1, isActive: 1, sortOrder: 1 });

const Banner = models.Banner ?? model<IBanner>('Banner', BannerSchema);
export default Banner;
