class RetryError extends Error {
  constructor(errors = []) {
    super('RetryError')
    this.errors = errors
  }
}



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
export const retry = (times) => (fn) => (...args) => {
  return new Promise((resolve, reject) => {
    const errors = [];
    const _retry = (times, fn) => {
      if (times <= 0) { return reject(new RetryError(errors)); }
      Promise.resolve()
        .then(fn)
        .then(resolve)
        .catch((error) => {
          errors.push(error);
          _retry(times - 1, fn)
        });
    };

    _retry(times, () => fn(...args), resolve, reject);
  });
};
