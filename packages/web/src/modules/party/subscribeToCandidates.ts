import { subscribe } from '../../utils/graphqlClient';
import users from '../../stores/users';
import { get } from 'svelte/store';
import me from '../../stores/me';
import party from '../../stores/party';

const RECEIVE_CANDIDATE_SUBSCRIPTION = `
subscription ReceiveCandidate($to: ID!) {
  receiveCandidate(to: $to) {
    from {
      id
      name
    }
    candidate
  }
}`;

const handler = ({ receiveCandidate }) => {
  const { from, candidate } = receiveCandidate;
  if (from.id !== get(me).id) {
    const client = users.get(from.id);
    if (client) {
      const iceCandidate = new RTCIceCandidate(JSON.parse(candidate));
      client.peer.receiveCandidate(iceCandidate);
    }
    console.log(`received candidate from ${from.name}`);
  }
};

export const subscribeToCandidate = (): () => void => {
  return subscribe({
    request: RECEIVE_CANDIDATE_SUBSCRIPTION,
    variables: { to: get(party).id }
  }, handler);
};
