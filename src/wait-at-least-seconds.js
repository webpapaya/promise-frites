import { delay } from './index';

/**
 * Ensures that the promise takes at least a certain amount of time until it resolves.
 * Might be used to prevent UI flickering when the API responds very fast.
 * @param {number} seconds
 * @returns {function}
 * @expamle
 * import { waitAtLeastSeconds } from 'promise-frites';
 *
 * const waitAtLeast1Second = waitAtLeastSeconds(1);
 * const apiCall = Promise.resolve('my api data');
 *
 * Promise.resolve()
 *   .then(waitAtLeast1Second(apiCall))
 *   .then((data) => data === 'my api data');
 */
export const waitAtLeastSeconds = (seconds) => (action) => (args) =>
  Promise.all([action(args), delay(seconds)]).then(([actionResult]) => actionResult);
