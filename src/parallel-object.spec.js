import { assertThat, hasProperties, equalTo } from 'hamjest';
import { parallelObject } from './parallel-object';

describe('parallelObject', () => {
  it('with promise given, returns resolved values as object', async () => {
    const result = await parallelObject({
      first: Promise.resolve(1),
      second: Promise.resolve(2),
    });

    assertThat(result, hasProperties({ first: 1, second: 2 }));
  });

  it('with functions given, returns resolved values as object', async () => {
    const result = await parallelObject({
      first: () => Promise.resolve(1),
      second: () => Promise.resolve(2),
    });

    assertThat(result, hasProperties({ first: 1, second: 2 }));
  });

  it('with batchSize parameter given, returns resolved values as object', async () => {
    const result = await parallelObject({
      first: () => Promise.resolve(1),
      second: () => Promise.resolve(2),
    }, { batchSize: 1 });

    assertThat(result, hasProperties({ first: 1, second: 2 }));
  });

  it('without any argument given returns empty object', () => {
    return parallelObject().then((result) => {
      assertThat(result, equalTo({}));
    });
  });
});
