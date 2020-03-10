import { utils } from 'xlsx';
import { WorksheetRange } from './types';

/**
 * Decodes a string cell reference to row and column numbers.
 *
 * @param {string} reference String reference of the cell.
 * @returns {[number, number]} Zero-indexed row and column numbers respectively.
 * @example
 * decodeCell('A1') // [0,0]
 */
export function decodeCell(reference: string): [number, number] {
  const { r, c } = utils.decode_cell(reference);
  return [r, c];
}

/**
 * Encodes a row and column number to a string cell reference.
 *
 * @param {number} row Zero-indexed row number.
 * @param {number} col Zero-indexed column number.
 * @returns {string} String reference of the cell.
 * @example
 * encodeCell(0,0) // 'A1'
 */
export function encodeCell(row: number, col: number): string {
  return utils.encode_cell({ r: row, c: col });
}

/**
 * Gets the string reference for the provided column number.
 *
 * @param col Zero-base column number.
 * @returns String reference of the column.
 * @example
 * encodeColumn(0) // 'A'
 */
export function encodeColumn(col: number): string {
  return utils.encode_col(col);
}

export function decodeRange(range: string): WorksheetRange {
  const decodedRange = utils.decode_range(range);
  if (!decodedRange) throw new Error('Cannot extract range.');

  return {
    startRow: decodedRange.s.r,
    endRow: decodedRange.e.r,
    startCol: decodedRange.s.c,
    endCol: decodedRange.e.c,
  };
}

export function isValidColumnReference(columnId: string): boolean {
  const [match, before, after] = columnId.match(/^([A-Z]{1,3})(?::([A-Z]{1,3}))?$/) || [];
  if (!match) return false;

  if (after) {
    return before === after;
  }

  return true;
}
