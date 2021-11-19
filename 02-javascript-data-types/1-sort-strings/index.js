/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
  const arrCopy = [...arr];
  const direction = param === 'desc' ? -1 : 1;
  const locales = ['ru', 'en'];

  return arrCopy.sort( (string1, string2) => {
    return direction * string1.localeCompare(string2, locales, { caseFirst: 'upper' });
  });
}
