/**
 * @file App entry
 * @module app/main
 */
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import type { NestExpressApplication } from '@nestjs/platform-express';
import {
  initializeTransactionalContext,
  patchTypeORMRepositoryWithBaseRepository,
} from 'typeorm-transactional-cls-hooked';
import * as compression from 'compression';
import * as bodyParser from 'body-parser';
import * as basicAuth from 'express-basic-auth';
import helmet from 'helmet';
import { setupLogLevels, setupSwagger } from '@core/index';
import { AppModule } from './app.module';

/**
 * On which port to run the application
 */
const APP_PORT = Number(process.env.APP_PORT);
/**
 * Is swagger enabled
 */
const SWAGGER = Boolean(process.env.SWAGGER);
/**
 * Swagger address
 */
const SWAGGER_URN = String(process.env.SWAGGER_URN);
/**
 * Login and password to access swagger UI
 */
const SWAGGER_AUTH_LOGIN = String(process.env.SWAGGER_AUTH_LOGIN);
const SWAGGER_AUTH_PASSWORD = String(process.env.SWAGGER_AUTH_PASSWORD);

/** Init app instance */
async function bootstrap(): Promise<NestExpressApplication> {
  /**
   * A transactional method for typeorm that uses cls-hooked to handle and propagate
   * transactions between different repositories and service methods.
   * ! first need to initialize the cls-hooked namespace before application is started
   * @see https://github.com/odavid/typeorm-transactional-cls-hooked
   */
  initializeTransactionalContext();
  /**
   * Patch the original Repository with the BaseRepository.
   * By doing so, you will be able to use the original Repository and not change the code
   * or use BaseRepository.
   */
  patchTypeORMRepositoryWithBaseRepository();

  /**
   * We create an application instance.
   * And we limit the output of logs that are used during development.
   */
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: setupLogLevels(process.env.NODE_ENV !== 'production'),
  });

  /**
   * Protect the swagger documentation with basic auth.
   * @see https://www.npmjs.com/package/express-basic-auth
   */
  if (SWAGGER) {
    app.use(
      [SWAGGER_URN, `${SWAGGER_URN}-json`],
      basicAuth({
        challenge: true,
        users: {
          [SWAGGER_AUTH_LOGIN]: SWAGGER_AUTH_PASSWORD,
        },
      }),
    );
  }

  /**
   * Protection against vulnerabilities by setting HTTP headers.
   * @see https://docs.nestjs.com/security/helmet
   */
  app.use(helmet());

  /**
   * To enable CORS
   * @see https://docs.nestjs.com/security/cors
   */
  app.enableCors();

  /**
   * Setting a prefix for each route
   * @see https://docs.nestjs.com/faq/global-prefix
   */
  app.setGlobalPrefix('api');

  /**
   * Allows you to have different versions of routes
   * @see https://docs.nestjs.com/techniques/versioning
   */
  app.enableVersioning();

  /**
   * Automatic validation at the application level, endpoints are protected from receiving incorrect data.
   * @see https://docs.nestjs.com/techniques/validation
   */
  app.useGlobalPipes(
    new ValidationPipe({
      /**
       * Property not included in the whitelist is automatically stripped from the resulting object
       */
      whitelist: true,
      /**
       * Automatically transform payloads to be objects types according to their DTO classes
       */
      transform: true,
    }),
  );

  /**
   * Compress all responses
   * @see https://github.com/expressjs/compression
   */
  app.use(compression());

  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  /**
   * Add a web ui for swagger
   */
  if (SWAGGER) setupSwagger(app, APP_PORT, SWAGGER_URN);

  return await app.listen(APP_PORT);
}

void bootstrap().then(() => {
  console.info(`Server running on port ${APP_PORT}`);
});
