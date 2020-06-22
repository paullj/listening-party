import { writable, get } from 'svelte/store';
import { mutate } from '../utils/graphqlClient';
import users from './users';
import me from './me';

const PARTY_QUERY = `
  query Party($id: ID!) {
    party(id: $id) {
      id
      name
      pin
    }
  }
  `;

const JOIN_PARTY_MUTATION = `
  mutation JoinParty($id: ID!) {
    joinParty(id: $id) {
      host {
        id
        name
      }
      users {
        id
        name
      }
    }
  }
  `;

const LEAVE_PARTY_MUTATION = `
  mutation LeaveParty {
    leaveParty
  }
  `;

interface Party {
  id?: string;
  name?: string;
  pin?: string;
}

const createPartyStore = () => {
  const { subscribe, set } = writable<Party>({});

  return {
    subscribe,
    get: async (id: string): Promise<boolean> => {
      const { party } = await mutate({
        request: PARTY_QUERY,
        variables: { id }
      });

      if (party) {
        set(party);
        return Promise.resolve(true);
      }

      return Promise.resolve(false);
    },
    join: async (id: string) => {
      const { joinParty } = await mutate({
        request: JOIN_PARTY_MUTATION,
        variables: { id }
      });
      if (joinParty) {
        const others = joinParty.users;
        others.forEach(client => {
          if (client.id !== get(me).id) {
            const user = users.add(client);
            user.peer.sendOffer(client.id);
          }
        });
      }
    },
    leave: async (): Promise<boolean> => {
      const { leaveParty } = await mutate({
        request: LEAVE_PARTY_MUTATION
      });
      return leaveParty;
    }
  };
};

export default createPartyStore();
