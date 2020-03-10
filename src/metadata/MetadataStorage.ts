import MetadataEntity from './MetadataEntity';

export default class MetadataStorage<TEntityOptions = unknown, TPropertyOptions = unknown> {
  private entities = new Map<Function, MetadataEntity<TEntityOptions, TPropertyOptions>>();

  getMetadata(target: Function): MetadataEntity<TEntityOptions, TPropertyOptions> {
    const entity = this.entities.get(target);
    if (!entity) this.entities.set(target, new MetadataEntity(target));

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.entities.get(target)!;
  }
}
