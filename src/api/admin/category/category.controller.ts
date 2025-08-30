import { Body, Controller, HttpStatus, Inject, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CategoryDto } from '~/api/admin/category/dto/category-dto';
import { CreateCategoryDto } from '~/api/admin/category/dto/create-category.dto';
import { CREATE_CATEGORY_USE_CASE, CreateCategoryUseCase } from '~/app/category/use-cases/create-category.use-case';
import { AppErrorStatusCode } from '~/app/errors/constants';
import { Doc, DocAnyOf, DocResponse } from '~/common/doc/decorators/doc.decorator';
import { Response } from '~/common/response/response.decorator';
import { IResponse } from '~/common/response/types';
import { UseCaseProxy } from '~/common/types/use-case';

@ApiTags('admin/categories')
@Controller('admin/categories')
export class CategoryController {
  constructor(
    @Inject(CREATE_CATEGORY_USE_CASE) private readonly createCategoryUseCase: UseCaseProxy<CreateCategoryUseCase>
  ) {}

  @Doc({ summary: 'Create category' })
  @DocResponse({ dto: CategoryDto })
  @DocAnyOf(
    HttpStatus.BAD_REQUEST,
    {
      statusCode: AppErrorStatusCode.CATEGORY.NOT_FOUND.code,
      message: AppErrorStatusCode.CATEGORY.NOT_FOUND.message
    },
    {
      statusCode: AppErrorStatusCode.CATEGORY.SLUG_EXIST.code,
      message: AppErrorStatusCode.CATEGORY.SLUG_EXIST.message
    }
  )
  @Response({})
  @Post()
  async create(@Body() payload: CreateCategoryDto): Promise<IResponse<CategoryDto>> {
    const category = await this.createCategoryUseCase.getInstance().execute(payload);
    return { data: new CategoryDto(category) };
  }
}
