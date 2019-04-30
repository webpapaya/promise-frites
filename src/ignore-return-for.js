import curry from "./curry";

/**
 * Ignores the return value of a given function and returns the value of the
 * previous function instead.
 * @example
 * import { ignoreReturnFor } from 'promise-frites';
 *
 * Promise.resolve()
 *   .then(() => '1 value')
 *   .then(ignoreReturnFor(() => '2 value'))
 *   .then((value) => value === '1 value')); // true
 */
export const ignoreReturnFor = curry((fn, arg) => Promise.resolve()
  .then(() => fn(arg))
  .then(() => arg));
