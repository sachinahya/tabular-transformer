import deepEqual from 'deep-equal';

interface ComparisonResult<T> {
  inserts: T[];
  updates: T[];
  deletes: T[];
}

type EqualityFn<T> = (currentItem: T, newItem: T) => boolean;

/**
 * The default strict equality comparison function.
 *
 * @param currentItem Current item.
 * @param newItem New item.
 * @returns A boolean indicating if the two items are equal.
 */
export const defaultEqualityFn: EqualityFn<unknown> = (currentItem, newItem) =>
  currentItem === newItem;

/**
 * Compares items and produces a list of inserts, updates and deletes.
 *
 * @template T Type of the item.
 * @param existingItems List of existing items.
 * @param newItems List of new items.
 * @param [equalityFn=(currentItem, newItem) => currentItem === newItem] Function to define equality between two items.
 * @returns Array of items for insertion, updating and deletion.
 */
const compareEntities = <T>(
  existingItems: T[],
  newItems: T[],
  equalityFn: EqualityFn<T> = defaultEqualityFn
): ComparisonResult<T> => {
  const inserts: T[] = [];
  const updates: T[] = [];
  const deletes = [...existingItems];

  for (const newTeam of newItems) {
    const existingTeamIndex = existingItems.findIndex(existingTeam =>
      equalityFn(existingTeam, newTeam)
    );

    if (existingTeamIndex === -1) {
      inserts.push(newTeam);
    } else {
      deletes.splice(existingTeamIndex);

      const existingTeam = existingItems[existingTeamIndex];
      if (!deepEqual(newTeam, existingTeam)) {
        updates.push(newTeam);
      }
    }
  }

  return { inserts, updates, deletes };
};

export default compareEntities;
