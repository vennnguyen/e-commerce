import { Product } from 'src/app/product/entities/product.entity';
import { VariantOptionValue } from 'src/app/product/entities/variant-option-value.entity';
import { BaseUuidEntity } from 'src/config/database/base-uuid.entity';
import { nullableDecimalColumn } from 'src/shared/utils/decimal-column.transformer';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity()
export class ProductVariant extends BaseUuidEntity {
  @Index()
  @Column({ type: 'uuid' })
  productId: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  sku: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  barcode: string | null;

  @Column(nullableDecimalColumn)
  price: number | null;

  @Column(nullableDecimalColumn)
  compareAtPrice: number | null;

  @Column({ type: 'int', default: 0 })
  stockQuantity: number;

  @Column({ type: 'int', default: 0 })
  lowStockThreshold: number;

  @Column(nullableDecimalColumn)
  weight: number | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  slug: string | null;

  @Column({ type: 'varchar', length: 1024, nullable: true })
  imageUrl: string | null;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @ManyToOne(() => Product, (product) => product.variants, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @OneToMany(() => VariantOptionValue, (link) => link.variant)
  optionValues: VariantOptionValue[];
}
