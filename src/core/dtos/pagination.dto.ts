import { ApiProperty } from '@nestjs/swagger';
import type { IPagination } from '../abstract-repository/interfaces';

export class PaginationDto<T> implements IPagination<T> {
  @ApiProperty({ isArray: true })
  items: T[];

  @ApiProperty({
    example: 1,
  })
  pageNumber: number;

  @ApiProperty({
    example: 10,
  })
  itemsPerPage: number;

  @ApiProperty({
    example: 215,
  })
  totalItems: number;

  @ApiProperty({
    example: 26,
  })
  totalPages: number;

  constructor(paginatedData: IPagination<T>) {
    this.items = paginatedData.items;
    this.pageNumber = paginatedData.pageNumber;
    this.itemsPerPage = paginatedData.itemsPerPage;
    this.totalItems = paginatedData.totalItems;
    this.totalPages = paginatedData.totalPages;
  }
}
