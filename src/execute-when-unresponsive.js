import {
  ignoreReturnFor,
  rethrowError,
} from './index';

const createTask = (fn, timeout) => {
  let timeoutId = setTimeout(() => {
    Promise.resolve()
      .then(fn)
      .then(() => { timeoutId = void 0 })
      .catch(() => { timeoutId = void 0 });
  }, parseFloat(timeout * 1000));

  return {
    getTimeoutId: () => timeoutId,
  };
};

const buildExecutionSchedule = (executionList) => Object.keys(executionList)
  .map((duration) => createTask(executionList[duration], duration));

const clearExecutionSchedule = (schedule) =>
  schedule.forEach((task) => clearTimeout(task.getTimeoutId()));

export const executeWhenUnresponsive = (executionList) => (fn) => (arg) => {
  const schedule = buildExecutionSchedule(executionList);
  return fn(arg)
    .then(ignoreReturnFor(() => clearExecutionSchedule(schedule)))
    .catch(rethrowError(() => clearExecutionSchedule(schedule)));
};
