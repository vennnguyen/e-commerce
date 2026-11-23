import { Product } from 'src/app/product/entities/product.entity';
import { BaseUuidEntity } from 'src/config/database/base-uuid.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class ProductAttribute extends BaseUuidEntity {
  @Index()
  @Column({ type: 'uuid' })
  productId: string;

  @Column({ name: 'attr_key', type: 'varchar', length: 255 })
  key: string;

  @Column({ name: 'attr_value', type: 'text' })
  value: string;

  @Column({ name: 'attr_group', type: 'varchar', length: 255, nullable: true })
  group: string | null;

  @Column({ type: 'int', default: 0 })
  displayOrder: number;

  @Column({ type: 'boolean', default: false })
  isFilterable: boolean;

  @ManyToOne(() => Product, (product) => product.attributes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
