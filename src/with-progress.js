import { ignoreReturnFor } from './ignore-return-for';

const PRECISION = 10000;

/**
 * Reports the progress of a promise chain to a given callback.
 * @param {function} progress a callback function which reports the progress in %
 * @param {array} promises an array of functions which are called sequentially
 * @param {number} start
 * @param {number} end
 * @returns {Promise}
 *
 * @example
 * // Simple example
 * const progress = (value) => console.log(value);
 * withProgress(progress, [
 *  () => Promise.resolve(),
 *  () => Promise.resolve(),
 *  () => Promise.resolve(),
 *  () => Promise.resolve(),
 *  () => Promise.resolve(),
 * ]);
 *
 * // Result
 * // => 0.0
 * // => 0.2
 * // => 0.4
 * // => 0.6
 * // => 0.8
 * // => 1.0
 *
 * @example
 * // a progress can have multiple subProgresses
 * const progress = (value) => console.log(value);
 * return withProgress(progress, [
 *   (_, { withSubProgress }) => withSubProgress(progress, [
 *     () => Promise.resolve()),
 *     () => Promise.resolve()),
 *   ]),
 *   (_, { withSubProgress }) => withSubProgress(progress, [
 *     () => Promise.resolve()),
 *     () => Promise.resolve()),
 *   ]),
 * ]);
 *
 * // Result
 * // => 0.0
 * // => 0.25
 * // => 0.5
 * // => 0.75
 * // => 1.0
 */
export const withProgress = (progress, promises, start = 0, end = 1) => {
  return promises.reduce((promise, currentPromise, index) => {
    const length = promises.length;

    const subStart = (1 / length) * index;
    const subEnd = (1 / length) * (index + 1);

    const progressToBeReported = ((end - start) / length) * index + start;
    const roundedProgress = Math.floor(progressToBeReported * PRECISION) / PRECISION;

    const withSubProgress = (subProgress, subPromises) =>
      withProgress(subProgress, subPromises, subStart, subEnd);

    return promise
      .then(ignoreReturnFor(() => progress(roundedProgress)))
      .then((value) => currentPromise(value, { withSubProgress }));
  }, Promise.resolve()).then(() => progress(end));
};
