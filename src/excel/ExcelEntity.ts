import { PropertyMetadata } from '../metadata/types';
import ExcelMetadataStorage from './ExcelMetadataStorage';
import { ColumnIdType, ExcelEntityOptions } from './types';
import { isValidColumnReference } from './utils';

const calculateColumnIdType = (mappings: PropertyMetadata[]): ColumnIdType => {
  return mappings.every(m => isValidColumnReference(m.columnId))
    ? ColumnIdType.ColumnReferences
    : ColumnIdType.RowHeadings;
};

const makeEntityDecorator = () => {
  return ({ columnIdType }: ExcelEntityOptions = {}): ClassDecorator => {
    return target => {
      const entity = ExcelMetadataStorage.getMetadata(target);
      entity.options = {
        columnIdType:
          columnIdType == null
            ? calculateColumnIdType([...entity.propertyMetadata.values()])
            : columnIdType,
      };
    };
  };
};

export default makeEntityDecorator();
