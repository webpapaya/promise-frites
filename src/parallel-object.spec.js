import { assertThat, hasProperties, equalTo } from 'hamjest';
import { parallelObject, delay } from './index';

describe('parallelObject', () => {
  describe('parallelism', () => {
    const promises = [
      () => delay(0.01),
      () => delay(0.02),
      () => delay(0.01),
    ];

    it('batch size is taken into account', () => {
      let message;
      return Promise.race([
        parallelObject(promises, { batchSize: 1 }).then(() => { message = 'failure'; }),
        parallelObject(promises, { batchSize: 2 }).then(() => { message = 'success'; }),
      ]).then(() => {
        assertThat(message, equalTo('success'));
      });
    });

    it('without batch size given, executes all in parallel', () => {
      let message;
      return Promise.race([
        parallelObject(promises, { batchSize: 2 }).then(() => { message = 'failure'; }),
        parallelObject(promises).then(() => { message = 'success'; }),
      ]).then(() => {
        assertThat(message, equalTo('success'));
      });
    });
  });

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
