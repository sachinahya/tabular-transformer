import { ReflectionTypes } from './reflection';

export class SymbolsNotSupportedError extends Error {
  constructor() {
    super('Symbols are not supported as property keys.');
  }
}

export class UnsupportedTypeError extends Error {
  constructor(type: ReflectionTypes) {
    super(`The ${type} type is not supported.`);
    this.name = 'UnsupportedTypeError';
  }
}

export class CastError extends Error {
  constructor(type: ReflectionTypes, originalValue: unknown, receivedValue?: unknown) {
    const typeString = type.name || type.toString?.() || type;
    const message = `Unable to cast value '${originalValue}' to type '${typeString}, received ${
      receivedValue instanceof Object ? receivedValue.constructor.name : ''
    } '${receivedValue}'.'`;

    super(message);
    this.name = 'CastError';
  }
}
