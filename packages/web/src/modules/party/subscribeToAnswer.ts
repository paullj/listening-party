import { subscribe } from '../../utils/graphqlClient';
import users from '../../stores/users';
import { get } from 'svelte/store';
import me from '../../stores/me';

const RECEIVE_ANSWER_SUBSCRIPTION = `
subscription ReceiveAnswer($me: ID!) {
  receiveAnswer(me: $me) {
    from {
      id
      name
    }
    answer
  }
}`;

const handler = ({ receiveAnswer }) => {
  const { from, answer } = receiveAnswer;
  const client = users.get(from.id);
  if (client) {
    client.peer.receiveAnswer(JSON.parse(answer));
  }
  console.log(`received answer from ${from.name}`);
};

export const subscribeToAnswer = (): () => void => {
  return subscribe({
    request: RECEIVE_ANSWER_SUBSCRIPTION,
    variables: { me: get(me).id }
  }, handler);
};
