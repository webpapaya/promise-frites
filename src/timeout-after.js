export const timeoutAfter = (seconds) => (action) => (args) => {
  let wasRejected = false;
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject('timeout');
      wasRejected = true;
    }, seconds * 1000);

    Promise.resolve(action(args)).then((result) => {
      clearTimeout(timeoutId);
      if(!wasRejected) { resolve(result); }
    });
  });
};
