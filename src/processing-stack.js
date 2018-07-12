/**
 * Executes all enqueued functions sequentially.
 */
export const createProcessingStack = () => {
  const processingStack = Promise.resolve();
  return (callback) => processingStack.then(callback);
};
