import { z } from 'zod';

// The field rules are shared; defaults are added only for creation. An update must NOT apply defaults,
// otherwise changing one field (e.g. just the name) would silently reset isActive, sortOrder and the
// other switches to their default values.
const categoryFields = {
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must be under 100 characters'),
  slug: z.string().min(2, 'Slug must be at least 2 characters').max(100).regex(/^[a-z0-9-]+$/, 'Slug may only contain lowercase letters, numbers and hyphens'),
  description: z.string().optional(),
  image: z.string().optional(),
  isActive: z.boolean(),
  showInMenu: z.boolean(),
  sortOrder: z.number().int('Sort order must be a whole number'),
};

export const CreateCategorySchema = z.object({
  ...categoryFields,
  isActive: categoryFields.isActive.default(true),
  showInMenu: categoryFields.showInMenu.default(false),
  sortOrder: categoryFields.sortOrder.default(0),
});

export const UpdateCategorySchema = z.object(categoryFields).partial();

const collectionFields = {
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must be under 100 characters'),
  slug: z.string().min(2, 'Slug must be at least 2 characters').max(100).regex(/^[a-z0-9-]+$/, 'Slug may only contain lowercase letters, numbers and hyphens'),
  description: z.string().optional(),
  image: z.string().optional(),
  bannerImage: z.string().optional(),
  isActive: z.boolean(),
  isFeatured: z.boolean(),
  sortOrder: z.number().int('Sort order must be a whole number'),
};

export const CreateCollectionSchema = z.object({
  ...collectionFields,
  isActive: collectionFields.isActive.default(true),
  isFeatured: collectionFields.isFeatured.default(false),
  sortOrder: collectionFields.sortOrder.default(0),
});

export const UpdateCollectionSchema = z.object(collectionFields).partial();
