import { ProductOption } from 'src/app/product/entities/product-option.entity';
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
export class ProductOptionValue extends BaseUuidEntity {
  @Index()
  @Column({ type: 'uuid' })
  optionId: string;

  @Column({ type: 'varchar', length: 255 })
  value: string;

  @Column({ type: 'varchar', length: 255 })
  label: string;

  @Column(nullableDecimalColumn)
  priceModifier: number | null;

  @Column({ type: 'int', default: 0 })
  displayOrder: number;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, unknown> | null;

  @ManyToOne(() => ProductOption, (option) => option.values, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'option_id' })
  option: ProductOption;

  @OneToMany(() => VariantOptionValue, (link) => link.optionValue)
  variantOptionValues: VariantOptionValue[];
}
