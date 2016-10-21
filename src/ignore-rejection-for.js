export const ignoreRejectionFor = (fn) => (arg) => Promise.resolve()
  .then(() => fn(arg))
  .catch((result) => result);
