import type { DeleteResult, UpdateResult, SelectQueryBuilder } from 'typeorm';
import type { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import type { IPaginationFilters } from './pagination-filters.interface';
import type { IPagination } from './pagination.interface';

export interface IAbstractRepository<Entity> {
  queryBuilder(alias?: string | undefined): SelectQueryBuilder<Entity>;

  create(data: Entity | any): Promise<Entity>;

  updateById(
    id: string,
    partialEntity: QueryDeepPartialEntity<Entity>,
  ): Promise<UpdateResult>;

  update(
    id: string,
    updateEntityData: QueryDeepPartialEntity<Entity>,
  ): Promise<Entity>;

  findOneById(id: string): Promise<Entity | undefined>;

  findOneByCondition(filterCondition: any): Promise<Entity | undefined>;

  findByCondition(
    filterCondition: any,
    take: number,
    skip: number,
  ): Promise<Entity[] | undefined>;

  findByConditionCount<K>(filterCondition: K): Promise<number>;

  findAll(): Promise<Entity[]>;

  remove(id: string): Promise<DeleteResult>;

  delete(id: string): Promise<Entity>;

  findWithRelations(relations: any): Promise<Entity[]>;

  findOneByIdOrFail(id: string): Promise<Entity>;

  findByConditionPaginated(
    filterConditions: IPaginationFilters,
  ): Promise<IPagination<Entity>>;
}
