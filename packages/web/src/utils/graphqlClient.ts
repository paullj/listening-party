import {
  Client,
  OperationContext,
  OperationResult,
  createClient,
  dedupExchange,
  fetchExchange,
  cacheExchange,
  subscriptionExchange,
  createRequest
} from '@urql/core';
import { pipe, subscribe as wonkaSubscribe } from 'wonka';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { authExchange, isTokenExpired, refreshToken, getToken } from './authExchange';
import { errorExchange } from './errorExchange';
import user from '../stores/user';

const subscriptionClient = new SubscriptionClient('ws://localhost:4000/graphql', {
  reconnect: true
  // connectionParams: async () => {
  //   if (isTokenExpired()) { await refreshToken(); }

  //   return {
  //     headers: {
  //       Authorization: `Bearer ${getToken()}`
  //     }
  //   };
  // }

});

const LOGIN_MUTATION = `
  mutation Login {
    login {
      id  
      accessToken
    }
  }
`;

export const initClient = (): Client => {
  const client = createClient({
    url: import.meta.env.SNOWPACK_PUBLIC_API_URL + '/graphql',
    fetchOptions: {
      credentials: 'include',
      mode: 'cors'
    },
    requestPolicy: 'network-only',
    exchanges: [
      dedupExchange,
      cacheExchange,
      authExchange(),
      errorExchange(data => {
        console.error(data);
      }),
      subscriptionExchange({
        forwardSubscription: (operation) => subscriptionClient.request(operation)
      }),
      fetchExchange
    ]
  });

  client.mutation(LOGIN_MUTATION)
    .toPromise()
    .then(({ data, error }) => {
      if (data.login) {
        const { id, accessToken } = data.login;
        user.set({ id, accessToken });
        console.info('Authentication successful.');
      }
      if (error) console.log(error);
    });
  return client;
};

const client = initClient();

interface Context extends Partial<OperationContext> {
  variables?: Record<string, unknown>
}

type Result = OperationResult<any>;

const query = (query: string, context?: Context): Promise<Result> => {
  return client.query(query, context?.variables, context).toPromise();
};

const mutate = async (query: string, context?: Context): Promise<Result> => {
  return client.mutation(query, context.variables, context).toPromise();
};

const subscribe = (query: string, handler: (data: any) => void, context?: Context): () => void => {
  const request = createRequest(query, context.variables);

  const { unsubscribe } = pipe(
    client.executeSubscription(request, context),
    wonkaSubscribe(result => {
      handler(result.data);
    })
  );
  return unsubscribe;
};

export { client, query, mutate as mutation, subscribe };
