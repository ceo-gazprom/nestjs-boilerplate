import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabseConfig } from './database.config';

@Module({
  imports: [TypeOrmModule.forRoot(DatabseConfig)],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
