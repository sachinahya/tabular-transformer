import logger from '@sachinahya/logger';
import { WorkSheet } from 'xlsx';
import { WorksheetRange } from './types';
import { decodeRange, encodeCell } from './utils';

interface RowsOptions {
  skipRows?: number;
}

interface IterableSheet {
  rows(options?: RowsOptions): RowIterable;
}

export interface Row {
  cells: () => CellIterable;
}

type RowDescriptor = [number, Row];
type RowIterable = Iterable<RowDescriptor>;
type RowIterator = Iterator<RowDescriptor>;

type CellIterable = Iterable<[number, string | null]>;

export default class ExcelSheet implements IterableSheet {
  get decodedRange(): WorksheetRange {
    return this.#decodedRange;
  }

  get range(): string {
    return this.#range;
  }

  set range(range: string) {
    this.#range = this.calculateNewRange(range);
    this.#decodedRange = decodeRange(this.#range);
  }

  #range: string;
  #decodedRange: WorksheetRange;
  readonly #sheet: WorkSheet;

  constructor(sheet: WorkSheet) {
    this.#sheet = sheet;
    const ref = this.#sheet['!ref'];
    if (!ref) throw new Error('Could not decode range.');
    this.#range = ref;
    this.#decodedRange = decodeRange(ref);
  }

  rows(options: RowsOptions = {}): RowIterable {
    return {
      [Symbol.iterator]: () => this.getRowIterator(options),
    };
  }

  getCellValue(reference: string): string | null;
  getCellValue(row: number, col: number): string | null;
  getCellValue(row: string | number, col: number = -1): string | null {
    const ref = typeof row == 'string' ? row : encodeCell(row, col);
    return this.#sheet[ref]?.v ?? null;
  }

  private getRowIterator({ skipRows = 0 }: RowsOptions = {}): RowIterator {
    const range = this.#decodedRange;
    let rowIndex = range.startRow + skipRows;
    return {
      next: () => {
        if (rowIndex > range.endRow) return { value: undefined, done: true };
        const cellIterable = { cells: () => this.getCellIterable(rowIndex++, range) };
        return { value: [rowIndex, cellIterable], done: false };
      },
    };
  }

  private getCellIterable(rowIndex: number, range: WorksheetRange): CellIterable {
    return {
      [Symbol.iterator]: () => {
        let colIndex = range.startCol;
        return {
          next: () => {
            if (colIndex > range.endCol) return { value: undefined, done: true } as const;
            return { value: [colIndex, this.getCellValue(rowIndex, colIndex++)], done: false };
          },
        };
      },
    };
  }

  private calculateNewRange(newRange: string): string {
    const currentRange = this.#range;
    const [fullMatch, ...segments] =
      newRange.match(/([A-Z]{1,3}|[0-9]+):([A-Z]{1,3}|[0-9]+)/) || [];

    const numerics = [Number(segments[0]), Number(segments[1])];
    const isAllChars = numerics.every(Number.isNaN);
    const isAllNum = numerics.every(x => !Number.isNaN(x));

    if (!fullMatch) {
      logger.warn(`'${newRange} is not a valid range.`);
      return currentRange;
    }

    if (newRange && (isAllChars || isAllNum)) {
      const regex = isAllChars ? /[A-Z]+/ : /[0-9]+/;
      return currentRange
        .split(':')
        .map((s, i) => s.replace(regex, segments[i]))
        .join(':');
    }

    return newRange;
  }
}
