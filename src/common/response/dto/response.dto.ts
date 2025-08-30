import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

export class ResponseMetadataDto {
  timestamp: number;
  path: string;
  [key: string]: any;
}

export class ResponseDto {
  @ApiProperty({
    name: 'statusCode',
    type: 'number',
    required: true,
    example: 200
  })
  statusCode: number;

  @ApiProperty({ type: 'string', required: false, example: 'Success' })
  message?: string;

  @ApiProperty({
    name: '_metadata',
    required: true,
    type: ResponseMetadataDto,
    example: {
      timestamp: 1660190937231,
      path: '/api/test'
    }
  })
  _metadata: ResponseMetadataDto;

  @ApiHideProperty()
  data?: Record<string, any>;
}
