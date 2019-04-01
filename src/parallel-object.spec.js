import { assertThat, hasProperties, equalTo } from 'hamjest';
import { parallelObject } from './parallel-object';

describe('parallelObject', () => {
  it('executes code blocks in parallel, and returns thema as object', () => {
    return parallelObject({
        first: Promise.resolve(1),
        second: Promise.resolve(2),
      }).then((result) => {
        assertThat(result, hasProperties({
          first: 1,
          second: 2
        }))
      });
  });

  it('without any argument given returns empty object', () => {
    return parallelObject().then((result) => {
      assertThat(result, equalTo({}));
    });
  });
});
