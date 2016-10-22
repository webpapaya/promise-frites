import {
  ignoreReturnFor,
  rethrowError,
} from './index';

const createTask = (fn, timeout) => {
  let timeoutId = void 0;
  let isRunning = false;

  const promise = new Promise((resolve) => {
    timeoutId = setTimeout(() => {
      isRunning = true;

      Promise.resolve()
        .then(fn)
        .then(() => { isRunning = false; })
        .catch(() => { isRunning = false; })
        .then(resolve)
    }, parseFloat(timeout) * 1000);
  });

  return {
    getPromise: () => promise,
    getTimeoutId: () => timeoutId,
    isRunning: () => !!isRunning,
  };
};

const buildExecutionSchedule = (executionList) => Object.keys(executionList)
  .map((duration) => createTask(executionList[duration], duration));

const clearIdleTasks = (schedule) => schedule
  .filter((task) => !task.isRunning())
  .map((task) => clearTimeout(task.getTimeoutId()));

const waitForRunningTasks = (schedule) => {
  const pendingPromises = schedule
    .filter((task) => task.isRunning())
    .map((task) => task.getPromise());

  return Promise.all(pendingPromises);
};

const clearExecutionSchedule = (schedule) => {
  clearIdleTasks(schedule);
  return waitForRunningTasks(schedule);
};

export const executeWhenUnresponsive = (executionList) => (fn) => (arg) => {
  const schedule = buildExecutionSchedule(executionList);
  return fn(arg)
    .then(ignoreReturnFor(() => clearExecutionSchedule(schedule)))
    .catch(rethrowError(() => clearExecutionSchedule(schedule)));
};
