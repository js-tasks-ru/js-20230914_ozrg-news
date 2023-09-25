/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
  const splittedPath = path.split('.');

  return function traverseObject(entity, depth = 0) {
    if ((entity !== null) && (typeof entity === 'object') && (splittedPath[depth] in entity)) {
      return traverseObject(entity[splittedPath[depth]], depth + 1);
    }

    return (depth < splittedPath.length) ? undefined : entity;
  };
}
