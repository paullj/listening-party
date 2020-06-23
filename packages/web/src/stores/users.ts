
import { WebRTCDispatcher } from '../utils/WebRTCDispatcher';
import { queue } from './queue';
import { PartyEventType } from '../constants';
import { state } from './state';

interface User {
  id: string,
  name: string,
  peer: WebRTCDispatcher
}

function createPeersStore () {
  const subscribers = [];

  const users: Map<string, User> = new Map<string, User>();

  const get = (id: string) => {
    const user = users.get(id);
    return user ?? null;
  };

  const remove = (id: string) => {
    users.delete(id);
    publish();
  };

  const add = (user: Partial<User>) => {
    const currentUser = get(user.id);

    if (!currentUser) {
      // return currentUser;
      // console.log(`${user.name} peer force closed`);
      // currentUser.peer.close();
      const peer = new WebRTCDispatcher();
      peer.bind('close', () => {
        console.log(`${user.name} peer closed`);
        remove(user.id);
      });
      peer.bind(PartyEventType.AddToQueue, queue.add);
      peer.bind(PartyEventType.ChangeState, (newState) => {
        state.set(newState);
      });

      users.set(user.id, {
        id: user.id,
        name: user.name,
        peer
      });
      publish();
    }
    return users.get(user.id);
  };

  const publish = () => {
    if (subscribers.length > 0) {
      const list = [...users.values()] || [];
      subscribers.forEach(s => s(list));
    }
  };

  const subscribe = (listener) => {
    const list = [...users.values()] || [];
    listener(list);
    subscribers.push(listener);
    return () => {
      const index = subscribers.indexOf(listener);
      if (index !== -1) {
        subscribers.splice(index, 1);
      }
    };
  };

  const send = (type, data) => {
    users.forEach((client) => {
      client.peer.send(type, data);
    });
  };

  const bind = (type: string, callback) => {
    users.forEach((client) => {
      client.peer.bind(type, callback);
    });
  };

  return {
    subscribe,
    get,
    add,
    send,
    bind,
    remove
  };
}

export default createPeersStore();
