export enum ColumnIdType {
  ColumnReferences,
  RowHeadings,
}

export interface ExcelEntityOptions {
  columnIdType?: ColumnIdType;
}

export interface ExcelColumnOptions {
  castFn?: (val: string) => unknown;
}

export type SheetReference = string | number;

export interface WorksheetRange {
  startRow: number;
  endRow: number;
  startCol: number;
  endCol: number;
}
