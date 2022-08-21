import type {
  DeleteResult,
  UpdateResult,
  Repository,
  SelectQueryBuilder,
  FindManyOptions,
  DeepPartial,
} from 'typeorm';
import type { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import type { WithoutAbstractEntityKeys } from '@core/types';
import type {
  IAbstractRepository,
  IPagination,
  IPaginationFilters,
} from './interfaces';

/**
 * Abstract Repository
 *
 * @description This class is an abstract class for all custom repositories.
 * An additional layer of abstraction helps to bring the general functionality
 * of custom repositories into one file.
 * And hide access to the basic functions of the repository from typeorm
 * or extend some of them.
 */
export abstract class AbstractRepository<Entity>
  implements IAbstractRepository<Entity>
{
  /**
   * Number of rows for pagination by default
   */
  public readonly defaultTake = 10;
  /**
   * Indent rows when sorting in default pagination
   */
  public readonly defaultSkip = 0;

  constructor(private entity: Repository<Entity>) {}

  public queryBuilder(alias?: string | undefined): SelectQueryBuilder<Entity> {
    return this.entity.createQueryBuilder(alias);
  }

  public create(data: Entity | any): Promise<Entity> {
    return this.entity.save(data);
  }

  public async update(
    id: string,
    partialEntity: QueryDeepPartialEntity<Entity>,
  ): Promise<Entity> {
    await this.entity.update(id, partialEntity);
    return this.findOneById(id);
  }

  public updateById(
    id: string,
    partialEntity: QueryDeepPartialEntity<Entity>,
  ): Promise<UpdateResult> {
    return this.entity.update(id, partialEntity);
  }

  public findOneById(id: string): Promise<Entity | undefined> {
    return this.entity.findOne(id);
  }

  public find(options: FindManyOptions): Promise<Entity[]> {
    return this.entity.find(options);
  }

  public findOneByCondition<K>(
    filterCondition: K,
  ): Promise<Entity | undefined> {
    return this.entity.findOne({ where: filterCondition });
  }

  public findByCondition<K>(
    filterCondition: K,
    take: number,
    skip: number,
  ): Promise<Entity[] | undefined> {
    return this.entity.find({ where: filterCondition, take, skip });
  }

  public findByConditionCount<K>(filterCondition: K): Promise<number> {
    return this.entity.count({ where: filterCondition });
  }

  public findWithRelations(relations: any): Promise<Entity[]> {
    return this.entity.find(relations);
  }

  public findAll(): Promise<Entity[]> {
    return this.entity.find();
  }

  public remove(id: string): Promise<DeleteResult> {
    return this.entity.delete(id);
  }

  /**
   * Delete entity
   * @description Unlike remove, it returns the removed entity.
   * @param id - entity id
   * @returns Deleted entity
   */
  public async delete(id: string): Promise<Entity> {
    const entityToRemove = await this.findOneById(id);
    await this.remove(id);
    return entityToRemove;
  }

  public generateEntites(data: DeepPartial<Entity>[]): Entity[] {
    return this.entity.create(data);
  }

  public save(data: DeepPartial<Entity>[]): Promise<DeepPartial<Entity>[]> {
    return this.entity.save(data);
  }

  /**
   * Returns the first row with the specified id
   * @param {Number} id
   * @returns entity or error
   */
  public findOneByIdOrFail(id: string): Promise<Entity> {
    return this.entity.findOneOrFail(id);
  }

  public async findByConditionPaginated(
    filterConditions: IPaginationFilters,
  ): Promise<IPagination<Entity>> {
    const { itemsPerPage, pageNumber, ...conditions } = filterConditions;

    const take = itemsPerPage ? itemsPerPage : this.defaultTake;
    const skip = pageNumber - 1 > 1 ? pageNumber * take : this.defaultSkip;

    const [items, itemsCount] = await this.entity
      .createQueryBuilder()
      .select()
      .where({
        ...conditions,
      })
      .take(take)
      .skip(skip)
      .getManyAndCount();

    return {
      items,
      pageNumber: pageNumber ? pageNumber : 1,
      itemsPerPage: take,
      totalItems: itemsCount,
      totalPages: Math.ceil(itemsCount / take),
    };
  }
}
