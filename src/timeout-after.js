/**
 * Rejects a promise after a given amount of time.
 * Might be used to display/log an error if an API endpoint takes longer than 5 seconds.
 * @param {number} seconds, number of seconds to wait until the promise is rejected with a timeout.
 * @example
 * import { timeoutAfter } from 'promise-frites';
 *
 * const timeoutAfter1Second = timeoutAfter(1);
 * const apiCall = () => { // a very slow api call };
 *
 * Promise.resolve()
 *   .then(timeoutAfter1Second(apiCall))
 *   .catch((error) => error === 'timeout');
 */
export const timeoutAfter = (seconds) => (action) => (args) => {
  let timeoutHandle = null;
  const waitInMilliSeconds = seconds * 1000;

  const timingOut = () => new Promise((resolve, reject) => {
    const fail = () => { reject('timeout'); };
    timeoutHandle = setTimeout(fail, waitInMilliSeconds);
  });

  const clearTimeoutHandle = () =>
    clearTimeout(timeoutHandle);

  const eitherOr = [
    Promise.all([action(args), clearTimeoutHandle()]),
    timingOut(),
  ];

  return Promise.race(eitherOr)
    .then((result) => result[0])
  ;
};
