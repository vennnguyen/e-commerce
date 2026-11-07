import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResEx } from 'src/swagger/response-examples';
import { RequireRoles } from 'src/core/decorators/roles-with-guard.decorator';
import { UserRole } from 'src/shared/types/enum';
@ApiTags('Danh mục (Category)')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @RequireRoles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Tạo danh mục mới', operationId: 'createCategory' })
  @ApiResponse({
    description: 'Danh mục được tạo thành công',
    schema: {
      example: ResEx.category.one,
    },
  })
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Lấy danh sách danh mục',
    operationId: 'getAllCategories',
  })
  @ApiResponse({
    description: 'Danh sách danh mục',
    schema: {
      example: ResEx.category.list,
    },
  })
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Lấy chi tiết danh mục',
    operationId: 'getCategoryById',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID của danh mục',
  })
  @ApiResponse({
    description: 'Chi tiết danh mục',
    schema: {
      example: ResEx.category.detail,
    },
  })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoryService.findOne(id);
  }

  @Patch(':id')
  @RequireRoles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Cập nhật danh mục',
    operationId: 'updateCategory',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID của danh mục',
  })
  @ApiResponse({
    description: 'Chi tiết danh mục',
    schema: {
      example: ResEx.category.one,
    },
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @RequireRoles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Xóa danh mục',
    operationId: 'deleteCategory',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID của danh mục',
  })
  @ApiResponse({
    description: 'Chi tiết danh mục',
    schema: {
      example: { success: true },
    },
  })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoryService.remove(id);
  }
}
