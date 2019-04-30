import curry from "./curry";

const _retry = (times, fn, resolve, reject) => {
  if (times <= 0) { return reject(); }
  Promise.resolve()
    .then(fn)
    .then(resolve)
    .catch((error) => _retry(times - 1, fn, resolve, () => reject(error)));
};

/**
 * Retries a promise n times.
 * @param {number} times the number of retries until the promise fails
 * @returns {function}
 * @example
 * import { retry } from 'promise-frites';
 *
 * const apiCall = () => { // a brittle api call };
 * const retry3Times = retry(3);
 * Promise.resolve()
 *  .then(retry3Times(apiCall))
 *  .then((value) => console.log(value))
 *  .catch((error) => console.log(error));
 */
export const retry = curry((times, fn, args) => {
  return new Promise((resolve, reject) => {
    _retry(times, () => fn(args), resolve, reject);
  });
});
