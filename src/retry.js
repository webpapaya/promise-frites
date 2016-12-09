const _retry = (times, fn, resolve, reject) => {
  if (times <= 0) { return reject(); }
  Promise.resolve()
    .then(fn)
    .then(resolve)
    .catch((error) => _retry(times - 1, fn, resolve, () => reject(error)));
};

export const retry = (times) => (fn) => (...args) => {
  return new Promise((resolve, reject) => {
    _retry(times, () => fn(...args), resolve, reject);
  });
};
