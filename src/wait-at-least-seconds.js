import { delay } from './index';

export const waitAtLeastSeconds = (seconds) => (action) => (args) =>
  Promise.all([action(args), delay(seconds)]).then(([actionResult]) => actionResult);
