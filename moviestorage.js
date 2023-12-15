// moviestorage.js

export function addToPersonalCollection(item) {
  // Get the existing collection from localStorage
  let personalCollection = getPersonalCollection();

  // If the collection is null or undefined, initialize it as an empty array
  if (!personalCollection) {
    personalCollection = [];
  }

  // Check if the item is already in the collection
  const isDuplicate = personalCollection.some(existingItem => existingItem.id === item.id);

  if (!isDuplicate) {
    // Add the new item to the collection
    personalCollection.push(item);

    // Save the updated collection to localStorage
    savePersonalCollection(personalCollection);
  }
}

// Add a function to get the personal collection from localStorage
export function getPersonalCollection() {
  const storedCollection = localStorage.getItem('personalCollection');
  return storedCollection ? JSON.parse(storedCollection) : null;
}

// Add a function to save the personal collection to localStorage
function savePersonalCollection(collection) {
  localStorage.setItem('personalCollection', JSON.stringify(collection));
}

export function clearPersonalCollection() {
  localStorage.removeItem('personalCollection');
}

// module.exports = {
//   addToPersonalCollection,
//   getPersonalCollection,
//   clearPersonalCollection
// }