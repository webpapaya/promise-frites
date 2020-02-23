import { promiseThat, fulfilled, rejected } from 'hamjest';
import { invert } from './index';

describe('invert', () => {
  it('returns a rejected promise when fullfilled', () => {
    const promise = Promise.resolve()
      .then(invert(() => Promise.resolve('test')));

    return promiseThat(promise, rejected('test'));
  });

  it('returns a fulfilled promise when rejected', () => {
    const promise = Promise.resolve()
      .then(invert(() => Promise.reject('test')));

    return promiseThat(promise, fulfilled('test'));
  });
});
