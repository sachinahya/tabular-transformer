import { PropertyMetadata, PropertySetter } from './types';
import makePropertySetter from './makePropertySetter';

export default class MetadataEntity<TEntityOptions = unknown, TPropertyOptions = unknown> {
  get propertyMetadata(): ReadonlyMap<string, PropertyMetadata<TPropertyOptions>> {
    return this._propertyMetadata;
  }

  options: TEntityOptions;

  readonly propertySetter: PropertySetter;

  readonly name: string;

  private readonly _propertyMetadata = new Map<string, PropertyMetadata<TPropertyOptions>>();

  constructor(target: Function) {
    this.name = target.name;
    this.propertySetter = makePropertySetter(target, this);
  }

  addColumnMapping(mapping: PropertyMetadata<TPropertyOptions>): void {
    this._propertyMetadata.set(mapping.columnId, mapping);
  }
}
