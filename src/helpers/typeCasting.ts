import { CastError, UnsupportedTypeError } from './errors';

export const castBoolean = (value: unknown): boolean => {
  value = typeof value == 'string' ? value.toUpperCase() : value;

  switch (value) {
    case 1:
    case '1':
    case 'TRUE':
      return true;

    case 0:
    case '0':
    case 'FALSE':
      return false;

    default:
      throw new CastError(Boolean, value);
  }
};

export const castNumber = (value: any, isInt: boolean): number => {
  const result = isInt ? Math.round(value) : parseFloat(value);
  if (Number.isNaN(result)) throw new CastError(Number, value, result);
  return result;
};

export const castType = (type: any, value: any): any => {
  switch (type) {
    case String:
      return value;

    case Number:
      return castNumber(value, false);

    case Date:
      return new Date(value);

    case Boolean:
      return castBoolean(value);

    default:
      throw new UnsupportedTypeError(type);
  }
};
