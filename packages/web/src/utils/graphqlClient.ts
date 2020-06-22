import {
  Client,
  OperationContext,
  createClient,
  dedupExchange,
  fetchExchange,
  cacheExchange,
  subscriptionExchange,
  createRequest
} from '@urql/core';
import { pipe, subscribe as wonkaSubscribe } from 'wonka';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { authExchange } from './authExchange';
import { errorExchange } from './errorExchange';
import me from '../stores/me';

const LOGIN_MUTATION = `
  mutation Login {
    login {
      id  
      accessToken
    }
  }
`;

export const initClient = (): Client => {
  const subscriptionClient = new SubscriptionClient('ws://localhost:4000/graphql', {
    reconnect: true,
    lazy: true
  });

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
        me.set({ id, accessToken });
        console.info('Authentication successful.');
      }
      if (error) console.log(error);
    });
  return client;
};

const client = initClient();

type Data = Record<string, any>;
type RequestOptions = {
  request: string,
  variables?: Data,
  context?: Partial<OperationContext>
}

const query = (options: RequestOptions): Promise<Data> => {
  const request = client.query(options.request, options?.variables, options?.context).toPromise();
  return Promise.resolve(request.then((response) => (response.data)));
};

const mutate = (options: RequestOptions): Promise<Data> => {
  const request = client.mutation(options.request, options?.variables, options?.context).toPromise();
  return Promise.resolve(request.then((response) => (response.data)));
};

const subscribe = (options: RequestOptions, handler: (data: Data) => void): () => void => {
  const request = createRequest(options.request, options?.variables);

  const { unsubscribe } = pipe(
    client.executeSubscription(request, options?.context),
    wonkaSubscribe(result => {
      handler(result.data);
    })
  );
  return unsubscribe;
};

export { client, query, mutate, subscribe };
