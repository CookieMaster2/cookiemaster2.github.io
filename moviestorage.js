const storageKey = 'personalCollection';

function getPersonalCollection() {
  const storedCollection = localStorage.getItem(storageKey);
  return storedCollection ? JSON.parse(storedCollection) : [];
}

export function addToPersonalCollection(movie) {
  let personalCollection = JSON.parse(localStorage.getItem('personalCollection')) || [];
  personalCollection.push(movie);
  localStorage.setItem('personalCollection', JSON.stringify(personalCollection));
}

export { getPersonalCollection };
