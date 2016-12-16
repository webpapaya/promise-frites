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
