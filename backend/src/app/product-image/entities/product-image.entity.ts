import { Product } from 'src/app/product/entities/product.entity';
import { BaseUuidEntity } from 'src/config/database/base-uuid.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
@Index('uq_primary_image_per_product', ['product_id'], {
  unique: true,
  where: '"is_primary" = true',
})
export class ProductImage extends BaseUuidEntity {
  @Index()
  @Column({ type: 'uuid' })
  product_id: string;

  @Column({ type: 'text' })
  image_key: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  alt_text: string | null;

  @Column({ type: 'int', default: 0 })
  display_order: number;

  @Column({ default: true })
  is_primary: boolean;
  //relations
  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
