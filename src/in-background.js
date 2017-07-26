/**
 * Doesn't wait for the promise to be resolved and continues with the promise chain.
 *
 * @param fn, function to be run in the background
 * @example
 * import { inBackground } from 'promise-frites';
 *
 * const logRemote = () => { // log something to a remote logging service };
 * Promise.resolve()
 *   .then(inBackground(logRemote))
 *   .then(() => console.log('I won\'t wait for logRemote'));
 */
export const inBackground = (fn) => (...args) => { fn(...args); };
