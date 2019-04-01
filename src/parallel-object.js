/**
 * Executes given promises in parallel and returns the values in an object
 *
 * @param object, an object containing promises
 * @param options, { batchSize } defines how many promises are executed in parallel (only works if functions are used in the given objects). This option is usefull when one wants to throttle the amount of parallel connections to an API.
 * @example
 * import { parallelObject } from 'promise-frites';
 *
 * const values = await parallelObject({
 *  first: Promise.resolve(1),
 *  second: Promise.resolve(2),
 * }); // => {first: 1, second: 2}
 *
 * @example
 * import { parallelObject } from 'promise-frites';
 *
 * // Only two elements will be resolved in parallel
 * const values = await parallelObject({
 *  first: () => Promise.resolve(1),
 *  second: () => Promise.resolve(2),
 *  // ...
 * }, { batchSize: 2 }); // => {first: 1, second: 2}
 */

const resolvePromise = (promise) => typeof promise === 'function'
  ? promise()
  : promise;

const toBatches = (array, options) => {
  const batchSize = options.batchSize || array.length;
  return array.reduce((result, promiseFn, index) => {
    if (index % batchSize === 0) {
      result.push([]);
    }
    result[result.length - 1].push(promiseFn);
    return result;
  }, []);
}

const parallel = (promiseFns, options = {}) => {
  const batches = toBatches(promiseFns, options);
  const result = [];
  const promise = batches.reduce((chunkPromise, chunks) => {
    return chunkPromise
      .then(() => chunks.map(resolvePromise))
      .then((promises) => Promise.all(promises))
      .then((promiseResult) => result.push(...promiseResult));
  }, Promise.resolve([]));

  return promise.then(() => result);
};

export const parallelObject = (object = {}, options) => {
  const keys = Object.keys(object);
  const promises = keys.map((key) => object[key]);

  return parallel(promises, options).then((values) => {
    return values.reduce((result, value, index) => {
      result[keys[index]] = value;
      return result;
    }, {});
  });
}