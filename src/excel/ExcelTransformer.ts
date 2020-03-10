import { Newable } from '../helpers/types';
import MetadataEntity from '../metadata/MetadataEntity';
import TabularDataTransformer from '../transformer/TabularDataTransformer';
import ExcelMetadataStorage from './ExcelMetadataStorage';
import ExcelSheet, { Row } from './ExcelSheet';
import { ColumnIdType, ExcelColumnOptions, ExcelEntityOptions } from './types';
import { encodeColumn } from './utils';

interface ExcelParserOptions {
  skipRows?: number;
}

export default class ExcelTransformer<TClassType> implements TabularDataTransformer<TClassType> {
  public options: ExcelParserOptions = { skipRows: 0 };
  private columnHeaders = new Map<number, string>();
  private metadata: MetadataEntity<ExcelEntityOptions, ExcelColumnOptions>;

  constructor(private classType: Newable<TClassType>, public readonly sheet: ExcelSheet) {
    this.metadata = ExcelMetadataStorage.getMetadata(this.classType);
  }

  transform(): TClassType[] {
    const { range, useRowHeadings } = this.getParseOptions();
    const entities: TClassType[] = [];

    for (const [rowIndex, row] of this.sheet.rows({ skipRows: this.options.skipRows })) {
      const firstRowIsHeadings = useRowHeadings && rowIndex === range.startRow;
      if (firstRowIsHeadings) {
        this.setColumnHeaders(row);
      } else {
        entities.push(this.readRow(row));
      }
    }

    return entities;
  }

  *getGenerator(): Generator<TClassType> {
    const { range, useRowHeadings } = this.getParseOptions();
    for (const [rowIndex, row] of this.sheet.rows({ skipRows: this.options.skipRows })) {
      const firstRowIsHeadings = useRowHeadings && rowIndex === range.startRow;
      if (firstRowIsHeadings) {
        this.setColumnHeaders(row);
      } else {
        yield this.readRow(row);
      }
    }
  }

  readRow(row: Row): TClassType {
    const entity = new this.classType();

    for (const [colIndex, cellValue] of row.cells()) {
      const columnId = this.columnHeaders.get(colIndex) || encodeColumn(colIndex);
      this.metadata.propertySetter.call(entity, columnId, cellValue);
    }

    return entity;
  }

  private setColumnHeaders(row: Row) {
    for (const [colIndex, cellValue] of row.cells()) {
      this.columnHeaders.set(colIndex, cellValue || '');
    }
  }

  private getParseOptions() {
    const range = this.sheet.decodedRange;
    const useRowHeadings = this.metadata.options?.columnIdType === ColumnIdType.RowHeadings;
    return { range, useRowHeadings };
  }
}
