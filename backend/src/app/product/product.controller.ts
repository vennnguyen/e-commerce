import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
  Patch,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ResEx } from 'src/swagger/response-examples';
import { RequireRoles } from 'src/core/decorators/roles-with-guard.decorator';
// import { UserRole } from 'src/shared/types/user-role.enum';
import { ProductSearchService } from 'src/app/product/product-search.service';
import { SearchProductDto } from 'src/app/product/dto/search-product.dto';
import { SuggestProductDto } from 'src/app/product/dto/suggest-product.dto';
import { UserRole } from 'src/shared/types/enum';

@ApiTags('Sản phẩm (Product)')
@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly productSearchService: ProductSearchService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Tạo sản phầm',
    operationId: 'product_create',
  })
  @ApiBearerAuth()
  @ApiCreatedResponse({
    description: 'Tạo sản phẩm thành công',
    schema: { example: ResEx.product.one },
  })
  @RequireRoles(UserRole.ADMIN)
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get('search')
  @ApiOperation({
    summary: 'Tìm kiếm sản phầm',
    operationId: 'product_search',
  })
  @ApiOkResponse({
    description: 'Ví dụ phản hồi',
    schema: { example: ResEx.product.search },
  })
  async search(@Query() dto: SearchProductDto) {
    return this.productSearchService.searchProducts(dto.query, {
      page: dto.page,
      limit: dto.limit,
      categoryId: dto.categoryId,
      minPrice: dto.minPrice,
      maxPrice: dto.maxPrice,
      isActive: dto.isActive,
      sortBy: dto.sortBy,
    });
  }

  @Get('suggest')
  @ApiOperation({
    summary: 'Gợi ý từ khóa tìm kiếm',
    operationId: 'product_suggest',
  })
  @ApiOkResponse({
    description: 'Ví dụ phản hồi',
    schema: { example: ResEx.product.suggest },
  })
  async suggest(@Query() dto: SuggestProductDto) {
    return this.productSearchService.suggest(dto.query, dto.size);
  }

  @Get('featured')
  @ApiOperation({
    summary: 'Sản phẩm nổi bật',
    operationId: 'product_featured',
  })
  @ApiOkResponse({
    description: 'Ví dụ phản hồi',
    schema: { example: ResEx.product.list },
  })
  async getFeatured(@Query('limit') limit?: string) {
    const limitNum = Math.min(Math.max(parseInt(limit || '8', 10) || 8, 1), 20);
    return this.productSearchService.getFeatured(limitNum);
  }

  @Get('landing')
  @ApiOperation({
    summary: 'Sản phẩm trang landing',
    operationId: 'product_landing',
  })
  @ApiOkResponse({
    description: 'Ví dụ phản hồi',
    schema: { example: ResEx.product.list },
  })
  async getLanding(@Query('limit') limit?: string) {
    const limitNum = Math.min(Math.max(parseInt(limit || '8', 10) || 8, 1), 20);
    return this.productSearchService.getFeatured(limitNum);
  }

  @Get(':id/pricing')
  @ApiOperation({
    summary: 'Giá và tồn kho sản phẩm',
    operationId: 'product_find_pricing',
  })
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Ví dụ phản hồi',
    schema: { example: ResEx.product.pricing },
  })
  @RequireRoles(UserRole.ADMIN, UserRole.CUSTOMER, UserRole.UNREGISTER)
  findPricing(@Param('id', ParseUUIDPipe) id: string) {
    return this.productService.findPricing(id);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Chi tiết sản phầm',
    operationId: 'product_find_one',
  })
  @ApiOkResponse({
    description: 'Ví dụ phản hồi',
    schema: { example: ResEx.product.one },
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const product = await this.productService.findOne(id);
    void this.productService.incrementView(id);
    return product;
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Cập nhật sản phẩm',
    operationId: 'product_update',
  })
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Ví dụ phản hồi',
    schema: { example: ResEx.product.one },
  })
  @RequireRoles(UserRole.ADMIN)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateProductDto,
  ) {
    return this.productService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Xóa sản phẩm',
    operationId: 'product_remove',
  })
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Ví dụ phản hồi',
    schema: { example: { success: true } },
  })
  @RequireRoles(UserRole.ADMIN)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productService.remove(id);
  }
}
