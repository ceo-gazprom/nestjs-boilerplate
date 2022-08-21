import type { IAbstractEntity } from '../abstract-entity/interfaces';

export type WithoutAbstractEntityKeys<Entity> = Omit<
  Entity,
  keyof IAbstractEntity
>;
