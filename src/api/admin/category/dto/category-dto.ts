import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

import { Category } from '~/persistence/category/types';

export class CategoryDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  slug: string;

  @ApiProperty({ nullable: true })
  description: string | null;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  order: number;

  @ApiProperty({ type: () => CategoryDto, isArray: true, nullable: true })
  @Type(() => CategoryDto)
  children: CategoryDto[] | null;

  @ApiProperty({ type: () => CategoryDto, nullable: true })
  @Type(() => CategoryDto)
  parent: CategoryDto | null;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;

  constructor(input: Category) {
    this.id = input.id;
    this.name = input.name;
    this.slug = input.slug;
    this.description = input.description;
    this.isActive = input.isActive;
    this.order = input.order;
    this.children = input.children ? input.children.map((child) => new CategoryDto(child)) : null;
    this.parent = input.parent ? new CategoryDto(input.parent) : null;
    this.createdAt = input.createdAt;
    this.updatedAt = input.updatedAt;
  }
}
