import logger from '@sachinahya/logger';
import { CastError } from '../helpers/errors';
import { ReflectionTypes } from '../helpers/reflection';
import { castType as castToType } from '../helpers/typeCasting';
import MetadataEntity from './MetadataEntity';
import { CastFn, PropertySetter } from './types';
import MissingMappings from '../transformer/MissingMappings';

const castValue = (value: unknown, type: ReflectionTypes, castFn?: CastFn) => {
  let newVal: string | number;
  if (castFn) {
    newVal = castFn(value);
    if (newVal?.constructor !== type) throw new CastError(type, value, newVal);
  } else {
    newVal = type !== String && typeof value == 'string' ? castToType(type, value) : value;
  }

  return newVal;
};

const makePropertySetter = (target: any, entity: MetadataEntity): PropertySetter => {
  const missingMappings = new MissingMappings();

  return function(this: Record<string, unknown>, columnId, value) {
    if (!(this instanceof target)) {
      logger.error("Value of 'this' is not of the entity type.");
      return;
    }

    const mapping = entity.propertyMetadata.get(columnId);
    if (!mapping) {
      missingMappings.log(columnId);
      return;
    }

    const newVal = castValue(value, mapping.type, mapping.options?.castFn);
    this[mapping.propertyKey] = newVal;
  };
};

export default makePropertySetter;
