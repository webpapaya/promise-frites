import { ignoreReturnFor } from './ignore-return-for';

const PRECISION = 10000;

export const withProgress = (progress, promises, start = 0, end = 1) => {
  return promises.reduce((promise, currentPromise, index) => {
    const length = promises.length;

    const subStart = (1 / length) * index;
    const subEnd = (1 / length) * (index + 1);

    const progressToBeReported = ((end - start) / length) * index + start;
    const roundedProgress = Math.floor(progressToBeReported * PRECISION) / PRECISION;

    const withSubProgress = (subProgress, subPromises) =>
      withProgress(subProgress, subPromises, subStart, subEnd);

    return promise
      .then(ignoreReturnFor(() => progress(roundedProgress)))
      .then((value) => currentPromise(value, { withSubProgress }));
  }, Promise.resolve()).then(() => progress(end));
};
