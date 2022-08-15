import { applyDecorators, Type } from '@nestjs/common';
import { ApiOkResponse, getSchemaPath, ApiExtraModels } from '@nestjs/swagger';
import { PaginationDto } from '../dtos';

/**
 * Api paginated decorator
 *
 * @description This decorator helps generate correct documentation
 * when the entity is a generic paginationDto
 *
 * @param model - Model which is generic for pagination dto.
 * @param description
 */
export const ApiPaginated = <TModel extends Type<any>>(
  model: TModel,
  description?: string,
) => {
  return applyDecorators(
    ApiExtraModels(PaginationDto),
    ApiOkResponse({
      description,
      schema: {
        allOf: [
          { $ref: getSchemaPath(PaginationDto) },
          {
            properties: {
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
            },
          },
        ],
      },
    }),
  );
};
