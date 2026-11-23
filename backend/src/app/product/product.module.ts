import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Category } from '../category/entities/category.entity';
import { ProductSearchService } from './product-search.service';
import { ProductOption } from './entities/product-option.entity';
import { ProductOptionValue } from './entities/product-option-value.entity';
import { ProductVariant } from './entities/product-variant.entity';
import { VariantOptionValue } from './entities/variant-option-value.entity';
import { ProductAttribute } from './entities/product-attribute.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      Category,
      ProductOption,
      ProductOptionValue,
      ProductVariant,
      VariantOptionValue,
      ProductAttribute,
    ]),
  ],
  controllers: [ProductController],
  providers: [ProductService, ProductSearchService],
  exports: [ProductService, ProductSearchService],
})
export class ProductModule {}
