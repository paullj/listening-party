import { writable, get } from 'svelte/store';
import { mutation } from '../utils/graphqlClient';
import peers from './peers';
import user from './user';

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
  const { subscribe, update, set } = writable<Party>({}, () => {
    return () => {
      //
    };
  });

  return {
    subscribe,
    get: async (id: string): Promise<boolean> => {
      const { data } = await mutation(PARTY_QUERY, { variables: { id } });
      if (data.party) {
        set(data.party);
        return Promise.resolve(true);
      }
      return Promise.resolve(false);
    },
    join: async (id: string): Promise<boolean> => {
      const { data } = await mutation(JOIN_PARTY_MUTATION, { variables: { id } });
      if (data.joinParty) {
        const others = data.joinParty.users;
        const me = get(user).id;
        others.forEach(client => {
          if (client.id !== me) {
            const peer = peers.add(client).connection;
            peer.sendOffer(client.id);
            console.log(`sent offer to ${client.id}`);
          }
        });
      }
      return Promise.resolve(false);
    },
    leave: async (): Promise<boolean> => {
      const { data } = await mutation(LEAVE_PARTY_MUTATION);

      return data.leaveParty;
    }
  };
};

export default createPartyStore();
