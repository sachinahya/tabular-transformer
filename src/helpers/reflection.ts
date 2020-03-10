import { UnsupportedTypeError } from './errors';

export type ReflectionTypes =
  | StringConstructor
  | NumberConstructor
  | BooleanConstructor
  | DateConstructor;

const supportedTypes: ReflectionTypes[] = [String, Number, Boolean, Date];

interface GetReflectedType {
  (metadataKey: 'design:type' | 'design:returntype'): (
    target: object,
    key: string
  ) => ReflectionTypes;
  (metadataKey: 'design:paramtypes'): (target: object, key: string) => ReflectionTypes[];
}

const getReflectedType: GetReflectedType = (metadataKey: string) => (
  target: object,
  key: string
) => {
  const type = Reflect.getMetadata(metadataKey, target, key);
  const isSupported = Array.isArray(type)
    ? type.every(t => supportedTypes.includes(t))
    : supportedTypes.includes(type);
  if (!isSupported) throw new UnsupportedTypeError(type);
  return type;
};

export const getPropertyType = getReflectedType('design:type');

export const getParamTypes = getReflectedType('design:paramtypes');

export const getReturnType = getReflectedType('design:returntype');
