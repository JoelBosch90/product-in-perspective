/**
 *  Helper function to see if two objects are equivalent. We currently support
 *  comparing Maps, Arrays and Objects.
 *  @param    {object}    objectA     The first object.
 *  @param    {object}    objectB     The second object.
 *  @returns  {boolean}
 */
const equal = (objectA, objectB) => {

  // If these are not true objects, we can simply use comparison operators to
  // make the comparison and we're done.
  if (objectA == objectB) return true;

  // If this is a map, we should use different logic.
  if (objectA instanceof Map) return equalMaps(objectA, objectB);

  // If this is an array, we should use different logic.
  if (objectA instanceof Array) return equalArrays(objectA, objectB);

  // If this is an object, we should apply different logic.
  if (objectA instanceof Object) return equalObjects(objectA, objectB);

  // We don't know what kind of objects we're dealing with, best to assume
  // they're not equal.
  return false;
}

/**
 *  Private method to compare two objects to see if they're the same.
 *  @param    {Object}   objectA      The first object.
 *  @param    {Object}   objectB      The second object.
 *  @returns  {boolean}
 */
const equalObjects = (objectA, objectB) => {

  // They should both be objects, or they're not equivalent.
  if (!objectA instanceof Object || !objectB instanceof Object) return false;

  // Get the size of the first object.
  const objectAEntries = Object.entries(objectA);

  // Two objects of different sizes cannot be equivalent.
  if (objectAEntries.length != Object.keys(objectB).length) return false;

  // No need to check the entire object if there are no entries.
  if (objectAEntries.length == 0) return true;

  // Loop through all of the entries of object A to check for an equivalent
  // in object B.
  for (const [key, value] of objectAEntries) {

    // These object cannot be equal if object B does not have the same property.
    if (!objectB.hasOwnProperty(key)) return false;

    // Otherwise, we can check the values for equality recursively.
    if (!equal(value, objectB[key])) return false;
  }

  // If we found no differences, we can conclude these maps are equivalent.
  return true;
}

/**
 *  Private method to compare two arrays to see if they're the same.
 *  @param    {Array}   arrayA      The first array.
 *  @param    {Array}   arrayB      The second array.
 *  @returns  {boolean}
 */
const equalArrays = (arrayA, arrayB) => {

  // They should both be arrays, or they're not equivalent.
  if (!arrayA instanceof Array || !arrayB instanceof Array) return false;

  // Two arrays of different sizes cannot be equivalent.
  if (arrayA.length != arrayB.length) return false;

  // No need to check the entire array if there are no entries.
  if (arrayA.length == 0) return true;

  // Loop through the keys and values of both maps simultaneously.
  for (let i = 0; i < arrayA.length; i++) {

    // Return false if any two values at the same index do not match.
    if (!equal(arrayA[i], arrayB[i])) return false;
  }

  // If we found no differences, we can conclude these maps are equivalent.
  return true;
}

/**
 *  Private method to compare two maps to see if they're the same.
 *  @param    {Map}     mapA       The first map.
 *  @param    {Map}     mapB       The second map.
 *  @returns  {boolean}
 */
const equalMaps = (mapA, mapB) => {

  // They should both be arrays, or they're not equivalent.
  if (!mapA instanceof Map || !mapB instanceof Map) return false;

  // Two maps of different sizes cannot be equivalent.
  if (mapA.size != mapB.size) return false;

  // No need to check the entire map if there are no entries.
  if (mapA.size == 0) return true;

  // Get iterators of the keys and values of both maps.
  const aKeys = mapA.keys();
  const aValues = mapA.values();
  const bKeys = mapB.keys();
  const bValues = mapB.values();

  // Loop through the keys and values of both maps simultaneously.
  for (let i = 0; i < mapA.size; i++) {

    // Return false if any keys or values do not match or are not in the exact
    // same order.
    if (!equal(aKeys.next().value, bKeys.next().value)) return false;
    if (!equal(aValues.next().value, bValues.next.value)) return false;
  }

  // If we found no differences, we can conclude these maps are equivalent.
  return true;
}

// Export the equal function.
export { equal };