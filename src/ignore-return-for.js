export const ignoreReturnFor = (fn) => (arg) => {
  fn(arg);
  return arg;
};

