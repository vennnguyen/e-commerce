import { ProductOptionValue } from 'src/app/product/entities/product-option-value.entity';
import { ProductVariant } from 'src/app/product/entities/product-variant.entity';
import { Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity()
export class VariantOptionValue {
  @PrimaryColumn({ type: 'uuid' })
  variantId: string;

  @Index()
  @PrimaryColumn({ type: 'uuid' })
  optionValueId: string;

  @ManyToOne(() => ProductVariant, (variant) => variant.optionValues, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'variant_id' })
  variant: ProductVariant;

  @ManyToOne(
    () => ProductOptionValue,
    (optionValue) => optionValue.variantOptionValues,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'option_value_id' })
  optionValue: ProductOptionValue;
}
