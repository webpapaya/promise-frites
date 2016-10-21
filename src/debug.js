import { ignoreReturnFor } from './index';
export const debug = ignoreReturnFor((arg) => console.log(arg)); // eslint-disable-line  no-console
