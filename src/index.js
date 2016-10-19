export const ignoreReturnFor = (fn) => (arg) => {
  fn(arg);
  return arg;
};

export const debug = ignoreReturnFor((arg) => console.log(arg)); // eslint-disable-line  no-console

export const rethrowError = (fn) => (error) => Promise.resolve()
  .then(() => fn(error))
  .then(() => { throw error; });

export const delay = (seconds) =>
  new Promise((resolve) => setTimeout(resolve, seconds * 1000));

export const waitAtLeastSeconds = (seconds) => (action) => (args) =>
  Promise.all([action(args), delay(seconds)]).then(([actionResult]) => actionResult);

export const parallel = (...args) => () =>
  Promise.all(args.map((fn) => fn()));

export const timeoutAfter = (seconds) => (action) => (args) => {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => reject('timeout'), seconds * 1000);
    Promise.resolve(action(args)).then((result) => {
      clearTimeout(timeoutId);
      resolve(result);
    });
  });
};
