import { writable } from 'svelte/store';
import { query, mutation } from '../utils/graphqlClient';

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
    query(ME_QUERY)
      .then(({ data }) => {
        set(data.me);
      });

    return () => {
      //
    };
  });

  return {
    subscribe,
    set,
    setName: (newName: string) => {
      update(user => ({ ...user, name: newName }));
      mutation(CHANGE_NAME_MUTATION, {
        variables: { newName }
      });
    }
  };
};

export default createUserStore();
