
import { WebRTCDispatcher } from '../utils/WebRTCDispatcher';

function createPeersStore () {
  const subscribers = [];
  const peers: { [id: string]: WebRTCDispatcher} = {};

  const remove = (id: string | number) => {
    delete peers[id];
    if (subscribers.length > 0) {
      const list = Object.values(peers) || [];
      subscribers.forEach(s => s(list));
    }
  };

  const add = (id) => {
    !peers[id] || peers[id].close();

    peers[id] = new WebRTCDispatcher();
    peers[id].bind('close', () => {
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
