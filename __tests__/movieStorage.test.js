import 'jest-localstorage-mock';
import { addToPersonalCollection, getPersonalCollection, clearPersonalCollection } from '../moviestorage.js';

beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
});

test('addToPersonalCollection should add an item to personal collection', () => {
    // Initial collection is empty
    expect(getPersonalCollection()).toBeNull();

    const item = { id: 123, title: 'Movie 1' };

    // Add the item to personal collection
    addToPersonalCollection(item);

    // Check if the item is in the collection
    expect(getPersonalCollection()).toEqual([item]);

    // Add another item to personal collection
    const newItem = { id: 456, title: 'Movie 2' };
    addToPersonalCollection(newItem);

    // Check if both items are in the collection
    expect(getPersonalCollection()).toEqual([item, newItem]);
});

test('addToPersonalCollection should not add duplicate items to personal collection', () => {
    const item = { id: 123, title: 'Movie 1' };

    // Add the item to personal collection
    addToPersonalCollection(item);

    // Attempt to add the same item again
    addToPersonalCollection(item);

    // Check that the collection still contains only one instance of the item
    expect(getPersonalCollection()).toEqual([item]);
});

test('clearPersonalCollection should remove the personal collection from localStorage', () => {
    const item = { id: 123, title: 'Movie 1' };

    // Add an item to personal collection
    addToPersonalCollection(item);

    // Check that the collection is not empty
    expect(getPersonalCollection()).not.toBeNull();

    // Clear the personal collection
    clearPersonalCollection();

    // Check that the collection is now empty
    expect(getPersonalCollection()).toBeNull();
});

// Add more test cases as needed
