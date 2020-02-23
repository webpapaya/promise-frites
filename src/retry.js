class RetryError extends Error {
  constructor(errors = []) {
    super('RetryError');
    this.errors = errors;
  }
}

/**
 * Retries a promise n times. When a retry exceeds the max retry times this function
 * throws a Retry error. This error has a property `errors` which is an array containing
 * all errors thrown.
 * @param {number} times the number of retries until the promise fails
 * @returns {function}
 * @example
 * import { retry } from 'promise-frites';
 *
 * const error = new Error('API example error');
 * const apiCall = () => { throw error };
 * const retry3Times = retry(3);
 * Promise.resolve()
 *  .then(retry3Times(apiCall))
 *  .then((value) => console.log(value))
 *  .catch((retryError) => {
 *    console.log(retryError.errors[0] === error); // true
 *    console.log(retryError.errors[1] === error); // true
 *    console.log(retryError.errors[2] === error); // true
 *  });
 */
export const retry = (times) => (fn) => (...args) => {
  return new Promise((resolve, reject) => {
    const _retry = (remainingTries, errors = []) => {
      if (remainingTries <= 0) { return reject(new RetryError(errors)); }

      Promise.resolve()
        .then(() => fn(...args))
        .then(resolve)
        .catch((error) => _retry(remainingTries - 1, [...errors, error]));
    };

    _retry(times);
  });
};
