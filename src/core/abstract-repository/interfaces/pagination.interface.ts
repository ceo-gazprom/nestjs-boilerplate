export interface IPagination<Entity> {
  items: Entity[];
  pageNumber: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}
