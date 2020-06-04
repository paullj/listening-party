import { dispatcher } from '../../utils/WebSocketDispatcher';
import peers from '../../stores/peers';

const joinParty = (partyId: number) => {
  dispatcher.bind('receive-clients', data => {
    console.log(`received ${data.clients.length} clients`);
    data.clients.forEach(client => {
      const peer = peers.add(client.clientId);
      peer.sendOffer(client.clientId);
      console.log(`sent offer to ${client.clientId}`);
    });
  });

  dispatcher.bind('receive-candidate', data => {
    const { from, candidate } = data;
    peers.get(from).receiveCandidate(candidate);

    console.log(`received candidates from ${from}`);
  });

  dispatcher.bind('receive-offer', data => {
    const { from, offer } = data;
    console.log(`received offer from ${from}`);

    const peer = peers.add(from);
    peer.sendAnswer(offer, from);

    console.log(`sent answer back to ${from}`);
  });

  dispatcher.bind('receive-answer', data => {
    const { from, answer } = data;
    peers.get(from).receiveAnswer(answer);

    console.log(`received answer from ${from}`);
  });
};

export { joinParty };
