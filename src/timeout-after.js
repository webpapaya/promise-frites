export const timeoutAfter = (seconds) => (action) => (args) => {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => reject('timeout'), seconds * 1000);
    Promise.resolve(action(args)).then((result) => {
      clearTimeout(timeoutId);
      resolve(result);
    });
  });
};
