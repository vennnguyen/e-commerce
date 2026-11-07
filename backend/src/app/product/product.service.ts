import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/app/product/entities/product.entity';
import { Category } from 'src/app/category/entities/category.entity';
import { Not, Repository } from 'typeorm';
import {
  apiBadRequest,
  apiConflict,
  apiNotFound,
} from 'src/shared/helpers/api-i18n';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(ProductService.name);
  }

  async create(dto: CreateProductDto) {
    const existingSlug = await this.productRepository.findOne({
      where: { slug: dto.slug },
    });

    if (existingSlug) {
      throw new ConflictException('Slug sản phẩm đã tồn tại');
    }

    const existingSku = await this.productRepository.findOne({
      where: { sku: dto.sku },
    });

    if (existingSku) {
      throw new ConflictException('Sku sản phẩm đã tồn tại');
    }

    const category = await this.categoryRepository.findOne({
      where: { id: dto.categoryId },
    });

    if (!category) {
      throw new BadRequestException('Danh mục không tồn tại');
    }

    const product = this.productRepository.create(dto);
    const saved = await this.productRepository.save(product);

    return this.findOne(saved.id);
  }

  findAll() {
    return `This action returns all product`;
  }

  async findOne(id: string) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: { category: true },
    });
    if (!product) apiNotFound('Không tìm thấy sản phẩm');
    return product;
  }

  async incrementView(id: string) {
    try {
      await this.productRepository.increment({ id }, 'viewCount', 1);
    } catch (error) {
      this.logger.error({
        msg: 'product.view.increment_failed',
        id,
        err: error as Error,
      });
    }
  }

  async findPricing(id: string) {
    const product = await this.productRepository.findOne({
      where: { id },
      select: {
        id: true,
        price: true,
        compare_at_price: true,
        stock_quantity: true,
      },
    });
    if (!product) apiNotFound('Không tìm thấy sản phẩm');

    return {
      price: product.price,
      compareAtPrice: product.compare_at_price,
      stockQuantity: product.stock_quantity,
    };
  }

  async update(id: string, dto: UpdateProductDto) {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) apiNotFound('Không tìm thấy sản phẩm');

    if (dto.slug) {
      const dup = await this.productRepository.findOne({
        where: { slug: dto.slug, id: Not(id) },
      });
      if (dup) apiConflict('Slug sản phẩm đã tồn tại');
    }

    if (dto.sku) {
      const dup = await this.productRepository.findOne({
        where: { sku: dto.sku, id: Not(id) },
      });
      if (dup) apiConflict('SKU sản phẩm đã tồn tại');
    }

    if (dto.categoryId) {
      const category = await this.productRepository.findOne({
        where: { id: dto.categoryId },
      });
      if (!category) apiBadRequest('Danh mục không tồn tại');
    }

    await this.productRepository.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string) {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) apiNotFound('Không tìm thấy sản phẩm');
    await this.productRepository.softDelete(id);
    return { success: true };
  }
}
