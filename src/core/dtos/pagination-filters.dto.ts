import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import type { IPaginationFilters } from '../abstract-repository/interfaces';

export class PaginationFiltersDto implements IPaginationFilters {
  @ApiProperty({
    example: 1,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  pageNumber?: number;

  @ApiProperty({
    example: 10,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  itemsPerPage?: number;
}
