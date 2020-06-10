
import { WebRTCDispatcher } from '../utils/WebRTCDispatcher';

interface User {
  id: string,
  name: string,
  connection: WebRTCDispatcher
}

function createPeersStore () {
  const subscribers = [];
  const peers: { [id: string]: User} = {};

  const remove = (id: string | number) => {
    delete peers[id];
    if (subscribers.length > 0) {
      const list = Object.values(peers) || [];
      subscribers.forEach(s => s(list));
    }
  };

  const add = (user: Partial<User>) => {
    const id = user.id;
    if (peers[id]) {
      console.log('peer force closed');
      peers[id].connection.close();
    }

    peers[id] = {
      id,
      name: user.name,
      connection: new WebRTCDispatcher()
    };
    peers[id].connection.bind('close', () => {
      console.log('peer closed');
      remove(id);
    });
    if (subscribers.length > 0) {
      const list = Object.values(peers) || [];
      subscribers.forEach(s => s(list));
    }
    return peers[id];
  };

  const get = (id) => {
    return peers[id];
  };

  return {
    subscribe (listener) {
      const list = Object.values(peers) || [];
      listener(list);
      subscribers.push(listener);
      return () => {
        const index = subscribers.indexOf(listener);
        if (index !== -1) {
          subscribers.splice(index, 1);
        }
      };
    },
    get,
    add,
    remove
  };
}

export default createPeersStore();
