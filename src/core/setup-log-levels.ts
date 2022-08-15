import { LogLevel } from '@nestjs/common';

/**
 * In production mode, we disable some logging levels so as not to clutter up the output
 */
export function setupLogLevels(isProduction: boolean): LogLevel[] {
  if (isProduction) {
    return ['log', 'warn', 'error'];
  }
  return ['error', 'warn', 'log', 'verbose', 'debug'];
}
