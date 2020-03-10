import { readFile } from 'fs';
import { promisify } from 'util';
import { read as readXlsx, WorkBook } from 'xlsx';
import ExcelSheet from './ExcelSheet';
import { SheetReference } from './types';

const readFilePromise = promisify(readFile);

export default class ExcelWorkbook {
  private _book?: WorkBook;
  private readonly _sheets = new Map<string, ExcelSheet>();

  get book(): WorkBook {
    if (!this._book) throw new Error('Workbook not loaded.');
    return this._book;
  }

  constructor(data?: Buffer) {
    if (data) this._book = readXlsx(data);
  }

  async loadFromFile(file: string): Promise<this> {
    this._book = readXlsx(await readFilePromise(file));
    return this;
  }

  sheets(sheetRef: SheetReference): ExcelSheet {
    const strSheetRef = typeof sheetRef === 'number' ? this.book.SheetNames[sheetRef] : sheetRef;
    let sheet = this._sheets.get(strSheetRef);

    if (!sheet) {
      sheet = new ExcelSheet(this.book.Sheets[strSheetRef]);
      this._sheets.set(strSheetRef, sheet);
    }

    return sheet;
  }
}
