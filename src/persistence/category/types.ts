export const CATEGORY_REPO = 'CATEGORY_REPO';

export interface ICategoryRepo {
  create(input: ICreateCategoryInput): Promise<Category>;
  findById(id: string): Promise<Category | null>;
  isSlugExists(slug: string): Promise<boolean>;
  isExistsById(id: string): Promise<boolean>;
}

interface WithTree<T> {
  children: T[] | null;
  parent: T | null;
}

export interface Category extends WithTree<Category> {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateCategoryInput {
  name: string;
  slug?: string;
  description?: string;
  isActive: boolean;
  order: number;
  parentId?: string;
}
