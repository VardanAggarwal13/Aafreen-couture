import { collectionRepository } from '@/server/repositories/collection.repository';
import { productRepository } from '@/server/repositories/product.repository';
import { NotFoundError, ConflictError } from '@/lib/api-errors';

export class CollectionService {
  async deleteCollection(id: string): Promise<void> {
    const collection = await collectionRepository.findById(id);
    if (!collection) throw new NotFoundError('Collection');

    const productCount = await productRepository.countByCollection(String(collection._id));
    if (productCount > 0) {
      throw new ConflictError(
        `Cannot delete "${collection.name}" — ${productCount} product${productCount === 1 ? '' : 's'} still assigned to it. Reassign or remove those products first.`
      );
    }

    await collectionRepository.delete(id);
  }
}

export const collectionService = new CollectionService();
