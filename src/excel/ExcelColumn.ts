import makeColumnDecorator from '../metadata/makeColumnDecorator';
import ExcelMetadataStorage, { ExcelColumnOptions } from './ExcelMetadataStorage';

export default makeColumnDecorator<ExcelColumnOptions>(ExcelMetadataStorage);
