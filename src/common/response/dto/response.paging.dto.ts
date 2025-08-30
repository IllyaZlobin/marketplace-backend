import { ApiProperty, PickType } from '@nestjs/swagger';

import { ResponseDto, ResponseMetadataDto } from '~/common/response/dto/response.dto';

export class PaginationMetadataDto {
  @ApiProperty({
    required: true,
    example: 1
  })
  itemCount: number;

  @ApiProperty({
    required: true,
    example: 20
  })
  totalItems: number;

  @ApiProperty({
    required: true,
    example: 30
  })
  itemsPerPage: number;

  @ApiProperty({
    required: true,
    example: 100
  })
  totalPages: number;

  @ApiProperty({
    required: true,
    example: 100
  })
  currentPage: number;
}

export class ResponsePagingMetadataDto extends ResponseMetadataDto {
  @ApiProperty({
    required: false,
    type: PaginationMetadataDto
  })
  pagination?: PaginationMetadataDto;
}

export class ResponsePagingDto extends PickType(ResponseDto, ['statusCode'] as const) {
  @ApiProperty({
    name: '_metadata',
    required: true,
    description: 'Contain metadata about API',
    type: ResponsePagingMetadataDto,
    example: {
      timestamp: 1660190937231,
      path: '/api/test',
      pagination: {
        itemCount: 1,
        totalItems: 20,
        itemsPerPage: 30,
        totalPages: 100,
        currentPage: 100
      }
    }
  })
  _metadata: ResponsePagingMetadataDto;

  @ApiProperty({
    required: true,
    isArray: true
  })
  data: Record<string, any>[];
}
