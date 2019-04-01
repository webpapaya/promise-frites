/**
 * Executes given promises in parallel and returns the values in an object
 *
 * @param object, an object containing promises
 * @example
 * import { parallelObject } from 'promise-frites';
 *
 * const values = await parallelObject({
 *  first: Promise.resolve(1),
 *  second: Promise.resolve(2),
 * }); // => {first: 1, second: 2}
 */
export const parallelObject = (object = {}) => {
  const keys = Object.keys(object);
  const promises = keys.map((key) => object[key])
  return Promise.all(promises).then((values) => {
    return values.reduce((result, value, index) => {
      result[keys[index]] = value;
      return result;
    }, {});
  });
}