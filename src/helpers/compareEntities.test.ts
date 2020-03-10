import compareEntities from '../lib/compareEntities';

interface TestEntity {
  name: string;
  age: number;
}

const jim: TestEntity = { name: 'Jim', age: 40 };
const bob: TestEntity = { name: 'Bob', age: 50 };
const bob2: TestEntity = { name: 'Bob', age: 65 };
const fred: TestEntity = { name: 'Fred', age: 60 };
const fred2: TestEntity = { name: 'Fred', age: 55 };

const emptyResult = {
  inserts: [],
  updates: [],
  deletes: [],
};

const comparisonFn = (currentItem: TestEntity, newItem: TestEntity) =>
  currentItem.name === newItem.name;

it('uses strict equality checking as the default', () => {
  const result = compareEntities(['Test'], ['Test']);
  expect(result).toEqual(emptyResult);
});

it('returns no items to insert, update or delete', () => {
  const existingItems = [jim];
  const newItems = [jim];

  const result = compareEntities(existingItems, newItems, comparisonFn);

  expect(result).toEqual(emptyResult);
});

it('updates Fred', () => {
  const existingItems = [fred];
  const newItems = [fred2];

  const result = compareEntities(existingItems, newItems, comparisonFn);

  expect(result.updates).toEqual([fred2]);
});

it('updates Bob, adds Fred and deletes Jim', () => {
  const existingItems = [jim, bob2];
  const newItems = [bob, fred];

  const result = compareEntities(existingItems, newItems, comparisonFn);

  expect(result.deletes).toEqual([jim]);
  expect(result.inserts).toEqual([fred]);
  expect(result.updates).toEqual([bob]);
});
