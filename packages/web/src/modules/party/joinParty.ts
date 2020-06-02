import { dispatcher } from '../../utils/WebSocketDispatcher';
import peers from '../../store/peers';

const joinParty = (partyId: number) => {
  dispatcher.bind('receive-clients', data => {
    data.clients.forEach(client => {
      const peer = peers.add(client.clientId);
      peer.sendOffer(client.clientId);
    });
    console.log(`received ${data.clients.length} clients`);
  });

  dispatcher.bind('receive-candidate', data => {
    const { from, candidate } = data;
    peers.get(from).receiveCandidate(candidate);

    console.log(`received candidates from ${from}`);
  });

  dispatcher.bind('receive-offer', data => {
    const { from, offer } = data;
    const peer = peers.add(from);
    peer.receiveOffer(offer, from);

    console.log(`receive-offer from ${from}`);
  });

  dispatcher.bind('receive-answer', data => {
    const { from, answer } = data;
    peers.get(from).receiveAnswer(answer);

    console.log(`received answer from ${from}`);
  });
};

export { joinParty };
