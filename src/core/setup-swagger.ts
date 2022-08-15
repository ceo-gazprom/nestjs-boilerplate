import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { name, version } from '../../package.json';

/**
 * Setup swagger UI
 *
 * @param app - app instance
 * @param appPort - what port is the application running on
 * @param urn - place of swagger ui
 */
export function setupSwagger(
  app: INestApplication,
  appPort: number,
  urn: string,
): void {
  /**
   * Metadata for documentation
   */
  const options = new DocumentBuilder()
    .setTitle(name)
    .setVersion(version)
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(urn, app, document);

  console.info(`Documentation: http://localhost:${appPort}${urn}`);
}
