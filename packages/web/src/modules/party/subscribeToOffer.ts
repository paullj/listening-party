import { subscribe } from '../../utils/graphqlClient';
import users from '../../stores/users';
import { get } from 'svelte/store';
import me from '../../stores/me';
import queue from '../../stores/queue';

const RECEIVE_OFFER_SUBSCRIPTION = `
subscription ReceiveOffer($me: ID!) {
  receiveOffer(me: $me) {
    from {
      id
      name
    }
    offer
  }
}`;

const handler = ({ receiveOffer }) => {
  const { from, offer } = receiveOffer;
  console.log(`received offer from ${from.name}`);
  const client = users.add(from);
  client.peer.sendAnswer(JSON.parse(offer), from.id);

  client.peer.bind('addToQueue', queue.add);

  console.log(`sent answer back to ${from.name}`);
};

export const subscribeToOffer = (): () => void => {
  return subscribe({
    request: RECEIVE_OFFER_SUBSCRIPTION,
    variables: { me: get(me).id }
  }, handler);
};
