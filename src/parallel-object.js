const resolvePromise = (promise) => typeof promise === 'function'
  ? promise()
  : promise;

const parallelArray = (promiseFns, options = {}) => new Promise((resolve) => {
  const poolSize = options.batchSize || promiseFns.length;
  const result = [];
  const promisePool = [];
  const promiseQueue = [...promiseFns];
  const promiseQueueLength = promiseFns.length;

  let isDone = false;

  const schedule = (promiseIndex) => {
    const promise = promiseQueue.shift();

    if (!promise) {
      isDone = true;
      Promise.all(promiseQueue).then(() => resolve(result));
    } else if (!isDone) {
      const resultIndex = promiseQueueLength - promiseQueue.length - 1;
      promisePool[promiseIndex] = Promise.resolve()
        .then(() => resolvePromise(promise))
        .then((r) => { result[resultIndex] = r; })
        .then(() => schedule(promiseIndex));
    }
  };

  Array.from({ length: poolSize }).forEach((_, index) => schedule(index));
});

const parallelObj = (object, options) => {
  const keys = Object.keys(object);
  const promises = keys.map((key) => object[key]);

  return parallelArray(promises, options).then((values) => {
    return values.reduce((result, value, index) => {
      result[keys[index]] = value; // eslint-disable-line no-param-reassign
      return result;
    }, {});
  });
};

/**
 * Executes given promises in parallel and returns the values in an object
 *
 * @param objectOrArray, an object or array containing promises or functions which return promises
 * @param options, { batchSize } defines how many promises are executed in parallel (only works
 *  if functions are used in the given objects). This option is usefull when one wants to throttle
 *  the amount of parallel connections to an API.
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
 *
 * * @example
 * import { parallelObject } from 'promise-frites';
 *
 * // Only two elements will be resolved in parallel
 * const values = await parallelObject([
 *  Promise.resolve(1),
 *  Promise.resolve(2),
 *  // ...
 * ], { batchSize: 2 }); // => {first: 1, second: 2}
 */
export const parallelObject = (objectOrArray, options = {}) => {
  return Array.isArray(objectOrArray)
    ? parallelArray(objectOrArray, options)
    : parallelObj(objectOrArray, options);
};
