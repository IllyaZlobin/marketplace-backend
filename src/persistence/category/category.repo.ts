import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

import { nonNull } from '~/common/utils/nonNull';
import { Category, ICategoryRepo, ICreateCategoryInput } from '~/persistence/category/types';
import { CategoryEntity } from '~/persistence/entities/category.entity';

export class CategoryRepoImpl implements ICategoryRepo {
  constructor(@InjectEntityManager() private readonly em: EntityManager) {}

  async create(input: ICreateCategoryInput): Promise<Category> {
    let parent: CategoryEntity | undefined = undefined;
    if (input.parentId) {
      parent = nonNull(await this.em.findOne(CategoryEntity, { where: { id: input.parentId } }));
    }
    const savedEntity = await this.em.save(CategoryEntity, { ...input, parent });
    const entity = await this.em.findOne(CategoryEntity, {
      where: { id: savedEntity.id },
      relations: ['parent', 'children']
    });
    return this.mapEntity(nonNull(entity));
  }
  async findById(id: string): Promise<Category | null> {
    const entity = await this.em.findOne(CategoryEntity, { where: { id }, relations: ['parent', 'children'] });
    return entity ? this.mapEntity(entity) : null;
  }

  async isSlugExists(slug: string): Promise<boolean> {
    const entity = await this.em.findOne(CategoryEntity, { where: { slug } });
    return !!entity;
  }
  async isExistsById(id: string): Promise<boolean> {
    const entity = await this.em.findOne(CategoryEntity, { where: { id } });
    return !!entity;
  }

  private mapEntity(entity: CategoryEntity): Category {
    const { id, name, slug, description, isActive, order, createdAt, updatedAt } = entity;
    return {
      id,
      name,
      slug,
      description,
      isActive,
      order,
      createdAt,
      updatedAt,
      children: entity.children ? entity.children.map((child) => this.mapEntity(child)) : null,
      parent: entity.parent ? this.mapEntity(entity.parent) : null
    };
  }
}
