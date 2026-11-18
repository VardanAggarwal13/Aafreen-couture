import { Schema, model, models, type Document, type Model } from 'mongoose';

export interface IPageImage extends Document {
  key: string;
  image: string;
  /** Focal point of the photo, 0-100 (% from left / top). Decides which part stays visible when cropped. */
  focalX?: number;
  focalY?: number;
  createdAt: Date;
  updatedAt: Date;
}

const PageImageSchema = new Schema<IPageImage>(
  {
    key: { type: String, required: true, unique: true, trim: true },
    image: { type: String, required: true },
    focalX: { type: Number, min: 0, max: 100 },
    focalY: { type: Number, min: 0, max: 100 },
  },
  { timestamps: true }
);

const PageImage: Model<IPageImage> = (models.PageImage as Model<IPageImage>) ?? model<IPageImage>('PageImage', PageImageSchema);

export default PageImage;
