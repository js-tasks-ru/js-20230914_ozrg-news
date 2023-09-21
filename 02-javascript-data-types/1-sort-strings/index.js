/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
  let arrCopy = [...arr];

  arrCopy.sort(compareFunction);

  if (param === 'desc') {
    arrCopy = arrCopy.reverse();
  }

  return arrCopy;
}

function compareFunction(a, b) {
  let minLength = Math.min(a.length, b.length);
  for (let i = 0; i < minLength; i++) {
    if (a[i] === b[i]) {
      continue;
    }

    if (a[i].toLowerCase() === b[i].toLowerCase()) {
      return (a[i].localeCompare(b[i]) === -1) ? 1 : -1;
    }

    return (a[i].toLowerCase()).localeCompare(b[i].toLowerCase());
  }

  return 0;
}
