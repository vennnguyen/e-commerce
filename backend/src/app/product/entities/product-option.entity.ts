import { ProductOptionValue } from 'src/app/product/entities/product-option-value.entity';
import { Product } from 'src/app/product/entities/product.entity';
import { BaseUuidEntity } from 'src/config/database/base-uuid.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity()
export class ProductOption extends BaseUuidEntity {
  @Index()
  @Column({ type: 'uuid' })
  productId: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'int', default: 0 })
  displayOrder: number;

  @Column({ type: 'varchar', length: 50, default: 'text' })
  type: string;

  @ManyToOne(() => Product, (product) => product.options, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @OneToMany(() => ProductOptionValue, (value) => value.option)
  values: ProductOptionValue[];
}
