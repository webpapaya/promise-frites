import curry from "./curry";

/**
 * Ignores if the given function throws an error or not and returns the value.
 * @example
 * import { ignoreRejectionFor } from 'promise-frites';
 *
 * const logToRemote = () => Promise.reject('Api Error');
 * Promise.resolve()
 *   .then(ignoreRejectionFor(logToRemote))
 *   .then((value) => assertThat(value, equalTo('Api Error')));
 */
export const ignoreRejectionFor = curry((fn, arg) => Promise.resolve()
  .then(() => fn(arg))
  .catch((result) => result));
