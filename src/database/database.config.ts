import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DatabaseLogger } from './database-logger';
import { SnakeNamingStrategy } from './snake-naming.strategy';
/**
 *
 */
export const DatabseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ['dist/**/*.entity{.ts,.js}'],
  namingStrategy: new SnakeNamingStrategy(),
  logging: process.env.NODE_ENV == 'development' ? true : false,
  logger:
    process.env.NODE_ENV == 'development' ? new DatabaseLogger() : undefined,

  /** We are using migrations, synchronize should be set to false. */
  synchronize: false,

  /**
   * Run migrations automatically
   * you can disable this if you prefer running migration manually.
   */
  migrationsRun: true,

  /**
   * Allow both start:prod and start:dev to use migrations
   * __dirname is either dist or src folder, meaning either
   * the compiled js in prod or the ts in dev.
   */
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
};
