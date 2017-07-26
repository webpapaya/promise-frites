const throwIfInstanceOf = (error, errorClass) => {
  if (error instanceof errorClass) { throw error; }
};

/**
 * Rethrows an error if it is an instance of a given list of errors.
 * @param {number} errors, array of errors
 * @example
 * import { rethrowIfOneOf } from 'promise-frites';
 *
 * const rethrowMyErrors = rethrowIfOneOf(MyCustomError1, MyCustomError2);
 * const logError = () => {};
 * const notifyUser = () => {};
 *
 * Promise.resolve()
 *   .then(myBrokenFunction)
 *   .catch(rethrowMyErrors(notifyUser))
 *   .catch(logError);
 */
export const rethrowIfOneOf = (...errors) => (fn) => (error) => Promise.resolve()
  .then(() => fn(error))
  .then(() => errors.forEach((errorClass) =>
    throwIfInstanceOf(error, errorClass)));
