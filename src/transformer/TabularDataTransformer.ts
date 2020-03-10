export default interface TabularDataTransformer<T> {
  transform(): T[];

  getGenerator(): Generator<T>;
}
