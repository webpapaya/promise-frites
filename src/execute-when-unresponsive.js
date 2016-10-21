import {
  ignoreReturnFor,
  rethrowError,
} from './index';

const scheduleExecution = (fn, timeout) =>
  setTimeout(fn, parseFloat(timeout * 1000));

const buildExecutionSchedule = (executionList) => Object.keys(executionList)
  .map((duration) => scheduleExecution(executionList[duration], duration));

const clearExecutionSchedule = (schedule) =>
  schedule.forEach((timeoutId) => clearTimeout(timeoutId));

export const executeWhenUnresponsive = (executionList) => (fn) => (arg) => {
  const schedule = buildExecutionSchedule(executionList);
  return fn(arg)
    .then(ignoreReturnFor(() => clearExecutionSchedule(schedule)))
    .catch(rethrowError(() => clearExecutionSchedule(schedule)));
};
