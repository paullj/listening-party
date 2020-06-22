import { writable } from 'svelte/store';
import { query, mutate } from '../utils/graphqlClient';

const ME_QUERY = `
  query Me {
    me {
      id
      name
    }
  }
`;

const CHANGE_NAME_MUTATION = `
  mutation ChangeName($newName: String!) {
    changeName(newName: $newName)
  }
`;

interface User {
    id?: string;
    name?: string;
    accessToken?: string;
}

const createUserStore = () => {
  const { subscribe, update, set } = writable<User>({}, () => {
    query({
      request: ME_QUERY
    }).then(({ me }) => {
      set(me);
    });
  });

  return {
    subscribe,
    set,
    setName: (newName: string) => {
      update(user => ({ ...user, name: newName }));
      mutate({
        request: CHANGE_NAME_MUTATION,
        variables: { newName }
      });
    }
  };
};

export default createUserStore();
