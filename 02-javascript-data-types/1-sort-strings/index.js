/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
  let arrCopy = [...arr];

  if (param === 'asc') {
    sortAsc(arrCopy);
  } else if (param === 'desc') {
    sortDesc(arrCopy);
  }

  return arrCopy;
}

function sortAsc(arr) {
  return arr.sort((a, b) => a.localeCompare(b, ["ru", "en"], {caseFirst: "upper"}));
}

function sortDesc(arr) {
  return arr.sort((a, b) => b.localeCompare(a, ["ru", "en"]), {caseFirst: "upper"});
}
