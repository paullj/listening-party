import { writable } from 'svelte/store';

interface User {
    name?: string;
}

const createUserStore = () => {
  const { subscribe, update, set } = writable<User>({}, () => {
    const name = localStorage.getItem('username') ?? null;
    set({
      name
    });

    return () => {

    };
  });

  return {
    subscribe,
    changeName: (newName: string) => {
      localStorage.setItem('username', newName);
      update(user => ({ ...user, name: newName }));
    }
  };
};

export default createUserStore();
