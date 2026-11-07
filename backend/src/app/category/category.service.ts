import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Product } from '../product/entities/product.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}
  async create(dto: CreateCategoryDto) {
    const slugExists = await this.categoryRepository.findOne({
      where: { slug: dto.slug },
    });
    if (slugExists) {
      throw new ConflictException('Slug already exists');
    }

    if (dto.parentId) {
      const parentCategory = await this.categoryRepository.findOne({
        where: { id: dto.parentId },
      });
      if (!parentCategory) {
        throw new BadRequestException('Parent category does not exist');
      }
    }
    const category = this.categoryRepository.create(dto);
    return this.categoryRepository.save(category);
  }

  async findAll() {
    return await this.categoryRepository.find({
      where: { isActive: true },
      order: { display_order: 'ASC', createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    const category = await this.categoryRepository.findOne({
      where: { id, isActive: true },
      relations: { children: true },
    });
    if (!category) {
      throw new NotFoundException('Không tìm thấy danh mục với ID đã cho');
    }
    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const existingCategory = await this.categoryRepository.findOne({
      where: { id },
    });
    if (!existingCategory) {
      throw new NotFoundException('Không tìm thấy danh mục');
    }
    if (updateCategoryDto.slug) {
      const slugExists = await this.categoryRepository.findOne({
        where: { slug: updateCategoryDto.slug, id: Not(id) },
      });
      if (slugExists) {
        throw new ConflictException('Slug đã tồn tại');
      }
    }
    if (updateCategoryDto.parentId) {
      if (updateCategoryDto.parentId === id) {
        throw new BadRequestException('Danh mục cha không thể là chính nó');
      }
      const parentCategory = await this.categoryRepository.findOne({
        where: { id: updateCategoryDto.parentId },
      });
      if (!parentCategory) {
        throw new BadRequestException('Danh mục cha không tồn tại');
      }
    }
    await this.categoryRepository.update(id, updateCategoryDto);
    return this.findOne(id);
  }

  async remove(id: string) {
    const existingCategory = await this.categoryRepository.findOne({
      where: { id },
    });
    if (!existingCategory) {
      throw new NotFoundException('Không tìm thấy danh mục');
    }
    const childCategories = await this.categoryRepository.count({
      where: { parentId: id },
    });
    if (childCategories > 0) {
      throw new ConflictException('Không thể xóa danh mục có danh mục con');
    }
    const productCount = await this.productRepository.count({
      where: { category_id: id },
    });
    if (productCount > 0) {
      throw new ConflictException('Không thể xóa danh mục có sản phẩm');
    }
    await this.categoryRepository.softDelete(id);
    return { success: true, message: 'Danh mục đã được xóa thành công' };
  }
}
