import { SymbolsNotSupportedError } from '../helpers/errors';
import { getPropertyType } from '../helpers/reflection';
import MetadataStorage from './MetadataStorage';

type ColumnDecoratorFactory = (columnId: string) => PropertyDecorator;

type ColumnDecoratorFactoryWithOptions<O = unknown> = (
  columnId: string,
  options?: O
) => PropertyDecorator;

interface MakeColumnDecorator {
  (storage: MetadataStorage): ColumnDecoratorFactory;
  <O>(storage: MetadataStorage<unknown, O>): ColumnDecoratorFactoryWithOptions<O>;
}

const makeColumnDecorator: MakeColumnDecorator = <O>(
  storage: MetadataStorage<unknown, O>
): ColumnDecoratorFactory | ColumnDecoratorFactoryWithOptions<O> => {
  return (columnId, options) => (target, propertyKey) => {
    if (typeof propertyKey == 'symbol') throw new SymbolsNotSupportedError();
    const type = getPropertyType(target, propertyKey);

    storage.getMetadata(target instanceof Function ? target : target.constructor).addColumnMapping({
      propertyKey,
      columnId,
      type,
      options,
    });
  };
};

export default makeColumnDecorator;
