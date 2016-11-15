const _sequence = (arg, ...fns) => {
  if (fns.length === 0) { return; }
  const [currentFn, ...rest] = fns;
  return Promise.resolve()
    .then(() => currentFn(arg))
    .then((newArg) => _sequence(newArg, ...rest));
};

export const sequence = (...fns) => _sequence(void 0, ...fns);
g
