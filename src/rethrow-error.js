import curry from "./curry";

/**
 * Rethrows an error catched in a catch block.
 * Might be used to log the error to the console and continue with the regular error handling.
 * @param {function} fn
 * @example
 * import { rethrowError } from 'promise-frites';
 *
 * const logError = (error) => console.error(error);
 * const displayErrorOnScreen = (error) => { // some magic };
 *
 * Promise.resolve()
 *   .then(() => { throw 'something unexpected'; })
 *   .catch(rethrowError(logError))
 *   .catch(displayErrorOnScreen);
 */

export const rethrowError = curry((fn, error) => Promise.resolve()
  .then(() => fn(error))
  .then(() => { throw error; }));
