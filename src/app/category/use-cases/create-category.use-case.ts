import { Inject } from '@nestjs/common';

import { CategoryNotFoundError, CategorySlugAlreadyExistsError } from '~/app/category/errors';
import { IUseCase } from '~/common/types/use-case';
import { generateSlug } from '~/common/utils/slug';
import { Category, CATEGORY_REPO, ICategoryRepo } from '~/persistence/category/types';

export const CREATE_CATEGORY_USE_CASE = 'CREATE_CATEGORY_USE_CASE';

export class CreateCategoryUseCase implements IUseCase<Category> {
  constructor(@Inject(CATEGORY_REPO) private readonly categoryRepo: ICategoryRepo) {}
  async execute(input: CreateCategoryUseCaseInput): Promise<Category> {
    if (input.parentId) {
      const isParentExists = await this.categoryRepo.isExistsById(input.parentId);
      if (!isParentExists) {
        throw new CategoryNotFoundError(`Parent category with id ${input.parentId} not found`);
      }
    }
    const slug = input.slug ?? generateSlug(input.name);
    const isSlugExists = await this.categoryRepo.isSlugExists(slug);
    if (isSlugExists) {
      throw new CategorySlugAlreadyExistsError(`Category with slug ${input.slug} already exists`);
    }
    const category = await this.categoryRepo.create({ ...input, slug });
    return category;
  }
}

interface CreateCategoryUseCaseInput {
  name: string;
  slug?: string;
  description?: string;
  isActive: boolean;
  order: number;
  parentId?: string;
}
