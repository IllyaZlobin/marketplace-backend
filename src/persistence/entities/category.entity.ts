import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
  TreeParent,
  UpdateDateColumn
} from 'typeorm';

@Index(['name', 'slug', 'isActive', 'order'])
@Index('ix_categories__name_vector', { synchronize: false })
@Tree('materialized-path')
@Entity({ name: 'categories' })
export class CategoryEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', unique: true })
  name: string;

  @Column({
    type: 'tsvector',
    nullable: false,
    select: false,
    update: false,
    insert: false
  })
  readonly name_vector = undefined;

  @Column({ type: 'varchar', unique: true })
  slug: string;

  @Column({ type: 'varchar', nullable: true })
  description: string | null;

  @Column({ default: true, name: 'is_active', type: 'boolean' })
  isActive: boolean;

  @Column({ type: 'int', default: 0 })
  order: number;

  @TreeChildren({ cascade: true })
  children?: CategoryEntity[];

  @TreeParent({ onDelete: 'CASCADE' })
  parent: CategoryEntity;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
