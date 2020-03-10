import MetadataEntity from '../metadata/MetadataEntity';
import TabularDataTransformer from '../transformer/TabularDataTransformer';
import SqlMetadataStorage from './SqlMetadataStorage';

export default class SqlTransformer<TClassType, TRecord>
  implements TabularDataTransformer<TClassType> {
  private metadata: MetadataEntity<any, any>;

  constructor(private classType: Newable<TClassType>, public recordSet: ArrayLike<TRecord>) {
    this.metadata = SqlMetadataStorage.getMetadata(this.classType);
  }

  transform(): TClassType[] {
    return Array.from(this.recordSet).map(rec => this.readRow(rec));
  }

  // eslint-disable-next-line class-methods-use-this
  getGenerator(): Generator<TClassType, any, unknown> {
    throw new Error('Method not implemented.');
  }

  readRow(record: TRecord): TClassType {
    const entity = new this.classType();

    for (const [columnId, value] of Object.entries(record)) {
      this.metadata.propertySetter.call(entity, columnId, value);
    }

    return entity;
  }
}
