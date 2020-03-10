import MetadataStorage from './MetadataStorage';

const target: Function = jest.fn();

let storage: MetadataStorage;

beforeEach(() => {
  storage = new MetadataStorage();
});

it('adds entities', () => {
  const fn = storage.getMetadata(target);
  const fn2 = storage.getMetadata(target);

  expect(fn).toStrictEqual(fn2);
});
