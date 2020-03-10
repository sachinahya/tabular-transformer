import { ReflectionTypes } from '../helpers/reflection';

export type PropertySetter = (propertyKey: string, value: string | null) => void;

export type CastFn = (val: unknown) => any;

interface PropertyMetadataOptions {
  castFn?: CastFn;
}

export interface PropertyMetadata<TPropertyOptions = unknown> {
  propertyKey: string;
  columnId: string;
  type: ReflectionTypes;
  options?: PropertyMetadataOptions & TPropertyOptions;
}
