import {
  ignoreReturnFor,
  rethrowError,
} from './index';
import curry from './curry';

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
        .then(resolve);
    }, parseFloat(timeout) * 1000);
  });

  return {
    getPromise: () => promise,
    getTimeoutId: () => timeoutId,
    isRunning: () => !!isRunning,
  };
};

const buildExecutionSchedule = (executionList) => Object.keys(executionList)
  .filter((duration) => duration !== 'finally')
  .map((duration) => createTask(executionList[duration], duration));

const clearIdleTasks = (schedule) => schedule
  .filter((task) => !task.isRunning())
  .map((task) => clearTimeout(task.getTimeoutId()));

const waitForRunningTasks = (schedule, executionList) => {
  const pendingPromises = schedule
    .filter((task) => task.isRunning())
    .map((task) => task.getPromise());

  const otherPromises = Object.keys(executionList)
    .filter((duration) => duration === 'finally')
    .map((duration) => executionList[duration]());

  return Promise.all([...pendingPromises, ...otherPromises]);
};

const clearExecutionSchedule = (schedule, executionList) => {
  clearIdleTasks(schedule);
  return waitForRunningTasks(schedule, executionList);
};

/**
 * Executes given functions after a specified time, when the promise takes long to resolve.
 * This function might be used to change the text on a loading page, so that the user knows
 * that the app is still doing something.
 * @param {object} executionList object of keys(seconds when to execute) and value is a function
 * @example
 * const shortDelay = 0.5; // seconds
 * const notifyUserOnLongRequest = executeWhenUnresponsive({
 *   [shortDelay]: () => { console.log('Hold on!'); },
 *   [shortDelay * 2]: () => { console.log('Almost there!'); },
 *   [shortDelay * 10]: () => { console.log('For some reason this takes some time!'); },
 *   finally: () => { console.log('We made it'); }, // might be used as a teardown fn.
 * });
 *
 * const apiCall = () => Promise.resolve();
 * Promise.resolve()
 *   .then(notifyUserOnLongRequest(apiCall))
 *   .then((result) => console.log(`API call responded ${result}`));
 */
export const executeWhenUnresponsive = curry((executionList, fn, arg) => {
  const schedule = buildExecutionSchedule(executionList);
  return fn(arg)
    .then(ignoreReturnFor(() => clearExecutionSchedule(schedule, executionList)))
    .catch(rethrowError(() => clearExecutionSchedule(schedule, executionList)));
});
