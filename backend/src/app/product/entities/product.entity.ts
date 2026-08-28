import { Category } from 'src/app/category/entities/category.entity';
import { BaseUuidEntity } from 'src/config/database/base-uuid.entity';
import {
  decimalColumn,
  decimalColumnTransformer,
  nullableDecimalColumn,
} from 'src/shared/utils/decimal-column.transformer';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
@Index('idx_product_featured', ['is_featured'], {
  where: '"is_featured" = true AND "is_active" = true AND "deleted_at" IS NULL',
})
export class Product extends BaseUuidEntity {
  @Index()
  @Column({ type: 'uuid' })
  category_id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  short_description: string | null;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'varchar', length: 255, unique: true })
  slug: string | null;

  @Column(decimalColumn)
  price: number;

  @Column(nullableDecimalColumn)
  compare_at_price: number | null;

  @Column({ default: 0 })
  stock_quantity: number;

  @Column({ unique: true })
  sku: string;

  @Column({ default: true })
  is_active: boolean;

  @Column({ default: true })
  is_featured: boolean;

  @Column({ default: true })
  has_variants: boolean;

  @Column({ default: 0 })
  view_count: number;

  @Column({
    default: 0,
    type: 'decimal',
    precision: 3,
    scale: 2,
    transformer: decimalColumnTransformer,
  })
  rating_avergage: number;

  @Column({ default: 0 })
  review_count: number;

  @Column(nullableDecimalColumn)
  weight: number | null;

  @Column({ type: 'timestamptz', nullable: true })
  deleted_at: Date | null;
  //relations
  @ManyToOne(() => Category)
  @JoinColumn({ name: 'category_id' })
  category: Category;
}
