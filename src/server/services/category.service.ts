import { categoryRepository } from '@/server/repositories/category.repository';
import { productRepository } from '@/server/repositories/product.repository';
import { NotFoundError, ConflictError } from '@/lib/api-errors';

export class CategoryService {
  async deleteCategory(id: string): Promise<void> {
    const category = await categoryRepository.findById(id);
    if (!category) throw new NotFoundError('Category');

    const productCount = await productRepository.countByCategory(String(category._id));
    if (productCount > 0) {
      throw new ConflictError(
        `Cannot delete "${category.name}" — ${productCount} product${productCount === 1 ? '' : 's'} still assigned to it. Reassign or remove those products first.`
      );
    }

    await categoryRepository.delete(id);
  }
}

export const categoryService = new CategoryService();
