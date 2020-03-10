import logger from '@sachinahya/logger';
import { performance } from 'perf_hooks';

const defaultMessageFn = (ms: number): string => `Time taken: ${ms}ms.`;

export const createTimer = (loggerFn: (message: string) => void = logger.info) => {
  const start = performance.now();

  return (messageFn: (ms: number) => string = defaultMessageFn): void => {
    const diff = Math.round(performance.now() - start);
    loggerFn(messageFn(diff));
  };
};
