import { Operation, Exchange } from '@urql/core';
import { pipe, share, filter, map, mergeMap, merge, fromPromise, fromValue } from 'wonka';
import { decode } from 'jwt-lite';

let accessToken: string;

const getToken = (): string => accessToken;
const isTokenExpired = (): boolean => !isTokenValid();
const refreshToken = async () : Promise<string> => await fetchAccessToken();

const isTokenValid = () => {
  if (!accessToken) {
    return false;
  }
  try {
    const { exp } = decode(accessToken);
    return Date.now() < exp * 1000;
  } catch (error) {
    return false;
  }
};

const fetchAccessToken = async () => {
  const response = await fetch(import.meta.env.SNOWPACK_PUBLIC_API_URL + '/token', {
    method: 'POST',
    credentials: 'include',
    mode: 'cors'
  });

  const data = await response.json();
  accessToken = data.accessToken;
  return accessToken;
};

const addTokenToOperation = (operation, token) => {
  const fetchOptions = typeof operation.context.fetchOptions === 'function'
    ? operation.context.fetchOptions()
    : (operation.context.fetchOptions || {});

  return {
    ...operation,
    context: {
      ...operation.context,
      fetchOptions: {
        ...fetchOptions,
        headers: {
          ...fetchOptions.headers,
          Authorization: `Bearer ${token}`
        }
      }
    }
  };
};

/**
  This exchange performs authentication and is a recipe.
  The `getToken` function gets a token, e.g. from local storage.
  The `isTokenExpired` function checks whether we need to refresh.
  The `refreshToken` function calls fetch to get a new token and stores it in local storage.
  */
const authExchange = (): Exchange => ({ forward }) => {
  let refreshTokenPromise = null;

  return ops$ => {
    // We share the operations stream
    const sharedOps$ = pipe(ops$, share);

    const withToken$ = pipe(
      sharedOps$,
      // Filter by non-teardowns
      filter((operation: Operation) => operation.operationName !== 'teardown'),
      mergeMap(operation => {
        // check whether the token is expired
        const isExpired = refreshToken || isTokenExpired();

        // If it's not expired then just add it to the operation immediately
        if (!isExpired) {
          return fromValue(addTokenToOperation(operation, accessToken));
        }

        // If it's expired and we aren't refreshing it yet, start refreshing it
        if (isExpired && !refreshTokenPromise) {
          refreshTokenPromise = refreshToken(); // we share the promise
        }

        return pipe(
          fromPromise(refreshTokenPromise),
          map(token => {
            refreshTokenPromise = null; // reset the promise variable
            return addTokenToOperation(operation, token);
          })
        );
      })
    );

    // We don't need to do anything for teardown operations
    const withoutToken$ = pipe(
      sharedOps$,
      filter(operation => operation.operationName === 'teardown')
    );

    return pipe(
      merge([withToken$, withoutToken$]),
      forward
    );
  };
};

export { authExchange, isTokenExpired, refreshToken, getToken };
