import { assertThat, hasProperties, equalTo } from 'hamjest';
import { parallelObject, delay, timeoutAfter } from './index';

describe('parallelObject', () => {
  describe('with object', () => {
    it('containing promises, returns resolved values as object', () => {
      return parallelObject({
        first: Promise.resolve(1),
        second: Promise.resolve(2),
      }).then((result) => assertThat(result, hasProperties({ first: 1, second: 2 })));
    });

    it('containing functions, returns resolved values as object', () => {
      return parallelObject({
        first: () => Promise.resolve(1),
        second: () => Promise.resolve(2),
      }).then((result) => assertThat(result, hasProperties({ first: 1, second: 2 })));
    });

    it('with batchSize parameter given, returns resolved values as object', () => {
      return parallelObject({
        first: () => Promise.resolve(1),
        second: () => Promise.resolve(2),
      }, { batchSize: 1 })
        .then((result) => assertThat(result, hasProperties({ first: 1, second: 2 })));
    });

    it('executes promises in parallel', () => {
      const promises = Array.from({ length: 10 }).reduce((obj, _, index) => {
        obj[`test${index}`] = () => delay(0.1);
        return obj;
      }, {});

      const timeout = timeoutAfter(0.2);
      return Promise.resolve()
        .then(timeout(() => parallelObject(promises)));
    });
  });

  describe('when array given', () => {
    it('containing promises, returns resolved values as array', () => {
      return parallelObject([
        Promise.resolve(1),
        Promise.resolve(2),
      ]).then((result) => assertThat(result, equalTo([1, 2])));
    });

    it('containing functions, returns resolved values as array', () => {
      return parallelObject([
        () => Promise.resolve(1),
        () => Promise.resolve(2),
      ]).then((result) => assertThat(result, equalTo([1, 2])));
    });
  });
});
