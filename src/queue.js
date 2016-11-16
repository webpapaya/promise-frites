const _queue = (args = [], ...fns) => {
  if (fns.length === 0) { return args; }
  const [currentFn, ...rest] = fns;
  return Promise.resolve()
    .then(() => currentFn(args))
    .then((newArg) => _queue([...args, newArg], ...rest));
};

export const queue = (...fns) => () => _queue(void 0, ...fns);

