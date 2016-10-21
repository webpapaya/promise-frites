const _retry = (times, fn, resolve, reject) => {
  if (times <= 0) { return reject(); }
  Promise.resolve()
    .then(fn)
    .then(resolve)
    .catch(() => _retry(times - 1, fn, resolve, reject));
};

export const retry = (times) => (fn) => (...args) => {
  return new Promise((resolve, reject) => {
    _retry(times, () => fn(...args), resolve, reject);
  }).catch(() => {
    throw new Error(`Couldn't resolve promise after ${times} retries.`);
  });
};
