import makeColumnDecorator from '../metadata/makeColumnDecorator';
import ExcelMetadataStorage from './ExcelMetadataStorage';
import { ExcelColumnOptions } from './types';

export default makeColumnDecorator<ExcelColumnOptions>(ExcelMetadataStorage);
