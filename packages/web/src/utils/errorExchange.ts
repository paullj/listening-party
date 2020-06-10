
import { pipe, onPush } from 'wonka';
import { CombinedError, Exchange } from '@urql/core';

const errorExchange = (onError: (error: CombinedError) => void): Exchange => ({ forward }) => {
  return ops$ => pipe(
    forward(ops$),
    onPush(result => {
      // This could also be more specific and check for `!result.data`, etc
      if (result.error) {
        onError(result.error);
      }
    })
  );
};

export { errorExchange };
