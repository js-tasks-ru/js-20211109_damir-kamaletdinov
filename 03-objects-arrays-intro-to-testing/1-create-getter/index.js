/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
  const pathArray = path.split('.');

  return (obj) => {
    let result = obj;

    const getItemValue = (pathIndex) => {
      if (pathIndex === pathArray.length || result === undefined) {
        return result;
      }
      result = result[pathArray[pathIndex]]
      return getItemValue(pathIndex + 1)
    }

    return getItemValue(0);
  }
}
