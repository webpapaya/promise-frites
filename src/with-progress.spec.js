import { assertThat, equalTo } from 'hamjest';
import { buildFunctionSpy, lastCallArgsWere, callCountWas } from 'hamjest-spy';
import { withProgress } from './with-progress';

describe('withProgress', () => {
  it('reports the progress of the promise chain', () => {
    const progress = buildFunctionSpy();
    return withProgress(progress, [
      () => assertThat(progress, lastCallArgsWere([0.0])),
      () => assertThat(progress, lastCallArgsWere([0.2])),
      () => assertThat(progress, lastCallArgsWere([0.4])),
      () => assertThat(progress, lastCallArgsWere([0.6])),
      () => assertThat(progress, lastCallArgsWere([0.8])),
    ]);
  });

  it('passes the arguments to the next callback', () => {
    const noop = () => {};
    const firstValue = 1;
    return withProgress(noop, [
      () => firstValue,
      (value) => { assertThat(value, equalTo(firstValue)); return value; },
      (value) => { assertThat(value, equalTo(firstValue)); return value; },
      (value) => { assertThat(value, equalTo(firstValue)); return value; },
      (value) => { assertThat(value, equalTo(firstValue)); return value; },
    ]);
  });

  it('calls all promises', () => {
    const randomPromise = buildFunctionSpy();
    return withProgress(() => {}, [
      randomPromise,
      randomPromise,
      randomPromise,
      randomPromise,
      randomPromise,
    ]).then(() => {
      assertThat(randomPromise, callCountWas(5));
    });
  });

  it('calls progress with 1 when done', () => {
    const progress = buildFunctionSpy();
    return withProgress(progress, [])
      .then(() => {
        assertThat(progress, callCountWas(1));
        assertThat(progress, lastCallArgsWere([1]));
      });
  });

  it('can report subprogress', () => {
    const progress = buildFunctionSpy();
    return withProgress(progress, [
      (_, { withSubProgress }) => withSubProgress(progress, [
        () => assertThat(progress, lastCallArgsWere([0.0])),
        () => assertThat(progress, lastCallArgsWere([0.25])),
      ]),
      (_, { withSubProgress }) => withSubProgress(progress, [
        () => assertThat(progress, lastCallArgsWere([0.5])),
        () => assertThat(progress, lastCallArgsWere([0.75])),
      ]),
    ]);
  });

  it('can report sub-sub-progress', () => {
    const progress = buildFunctionSpy();
    return withProgress(progress, [
      () => {},
      (_, { withSubProgress }) => withSubProgress(progress, [
        () => assertThat(progress, lastCallArgsWere([0.5])),
        () => assertThat(progress, lastCallArgsWere([0.75])),
      ]),
    ]);
  });
});

