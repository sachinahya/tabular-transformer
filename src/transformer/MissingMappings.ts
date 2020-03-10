import logger from '@sachinahya/logger';

export default class MissingMappings {
  private warnedColumns = new Set<string>();

  constructor(private className?: string) {}

  log(columnId: string): void {
    if (!this.warnedColumns.has(columnId)) {
      logger.info(
        `Unable to find a mapping${
          this.className ? ` in class '${this.className}'` : ''
        } for column '${columnId}'.`
      );
      this.warnedColumns.add(columnId);
    }
  }
}
