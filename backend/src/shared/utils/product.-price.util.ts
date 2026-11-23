import { ProductVariant } from 'src/app/product/entities/product-variant.entity';
import { Product } from 'src/app/product/entities/product.entity';

export function parseMoney(value: unknown): number {
  if (value === null || value === undefined) return 0;
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
  if (typeof value === 'string') {
    const parsed = Number(value.replace(/,/g, '').trim());
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

export function sumVariantOptionModifiers(
  variant: ProductVariant | null | undefined,
): number {
  return (variant?.optionValues ?? []).reduce(
    (sum, link) => sum + parseMoney(link.optionValue?.priceModifier),
    0,
  );
}

export function resolveVariantUnitPrice(
  product: Pick<Product, 'price'>,
  variant: ProductVariant | null | undefined,
): number {
  const basePrice = parseMoney(product.price);
  if (!variant) return basePrice;

  if (variant.price != null) {
    const explicit = parseMoney(variant.price);
    if (explicit > 0) return explicit;
  }

  return basePrice + sumVariantOptionModifiers(variant);
}

export function resolveProductListingPrice(product: Product): number {
  const basePrice = parseMoney(product.price);
  if (!product.hasVariants || !product.variants?.length) return basePrice;

  const pool = product.variants.filter((v) => v.isActive);
  const variants = pool.length ? pool : product.variants;

  const prices = variants
    .map((v) => resolveVariantUnitPrice(product, v))
    .filter((p) => p > 0);
  return prices.length ? Math.min(...prices) : basePrice;
}
