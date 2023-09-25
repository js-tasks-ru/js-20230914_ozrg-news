/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  if (string.length <= 1) {
    return string;
  }

  let newStr = "";
  let counter = 1;
  let prevChar = string[0];

  for (let i = 1; i < string.length; i++) {
    if (prevChar === string[i]) {
      counter++;
    } else {
      newStr += string.slice(i - counter, i - counter + size);
      counter = 1;
    }

    prevChar = string[i];
  }

  if (counter > size) {
    newStr += string.slice(string.length - counter, string.length - counter + size);
  } else {
    newStr += string.slice(string.length - counter, string.length);
  }

  return newStr;
}
