export const parallel = (...args) => () =>
  Promise.all(args.map((fn) => fn()));
