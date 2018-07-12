/**
 * Waits at least given amount of seconds before the promise is resolved.
 * Might be used if you need to show a loading screen (eg. fetching GPS) but
 * don't want to it flicker when user has GPS rejected.
 * @param {number} seconds, number of seconds to wait before the promise is resolved.
 * @example
 * import { delay } from 'promise-frites';
 *
 * const arbitaryDelay = delay(1);
 *
 * Promise.resolve()
 *   .then(arbitaryDelay(() => 'a very fast resolving promise'))
 */
export const delay = (seconds) =>
  new Promise((resolve) => setTimeout(resolve, seconds * 1000));
