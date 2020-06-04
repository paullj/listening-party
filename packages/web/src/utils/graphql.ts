import createClient from '@fabienjuif/graph-client';
import { decode } from 'jwt-lite';

const LOGIN_MUTATION = `
  mutation Login {
    login(name: "TESTTTT") {
      accessToken
    }
  }
`;

let accessToken: string;

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
  return data.accessToken;
};

const connectGraphQL = async () => {
  const graphql = createClient({
    url: import.meta.env.SNOWPACK_PUBLIC_API_URL + '/graphql',
    fetch: (input: RequestInfo, init?: RequestInit) => {
      return fetch(input, { ...init, credentials: 'include' });
    },
    token: async () => {
      if (!isTokenValid()) {
        accessToken = await fetchAccessToken();
      }
      return Promise.resolve(accessToken);
    }
  });
  graphql.setHeaders({
    credentials: 'include'
  });

  const QUERY = `
    query Hi {
      hi
    }`;

  graphql(QUERY)
    .then(({ hi }) => console.log(hi))
    .catch(error => console.log(error));

  await graphql(LOGIN_MUTATION)
    .then(({ login }) => {
      if (login) { accessToken = login.accessToken; }
    });

  graphql('query Me { me { id name } }')
    .then(data => console.log(data))
    .catch(error => console.error(error));
};

connectGraphQL();
