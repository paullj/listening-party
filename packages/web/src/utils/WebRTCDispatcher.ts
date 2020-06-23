import { mutate } from './graphqlClient';

type Callback = (data: any) => void;

const SEND_OFFER_MUTATION = `
  mutation SendOffer($to: ID!, $offer: String!) {
    sendOffer(to: $to, offer: $offer)
  }
`;

const SEND_ANSWER_MUTATION = `
  mutation SendAnswer($to: ID!, $answer: String!) {
    sendAnswer(to: $to, answer: $answer)
  }
`;

const SEND_CANDIDATE_MUTATION = `
  mutation SendCandidate($candidate: String!) {
    sendCandidate(candidate: $candidate)
  }
`;

class WebRTCDispatcher {
  peer: RTCPeerConnection;
  channel: RTCDataChannel;
  callbacks: { [key: string]: Callback[] } = {};

  constructor () {
    this.peer = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' }
      ]
    });
    this.channel = this.peer.createDataChannel('message', {
      negotiated: true,
      id: 0
    });

    this.channel.onclose = () => {
      this.dispatch('close', null);
    };
    this.channel.onopen = () => {
      this.dispatch('open', null);
    };

    this.channel.onmessage = (message) => {
      let json: { type?: string; data?: any; };
      try {
        json = JSON.parse(message.data);
      } catch (e) {
        console.error('Invalid JSON');
        json = {};
      }
      this.dispatch(json.type, json.data);
    };

    this.peer.onicecandidate = e => {
      if (e.candidate) {
        mutate({
          request: SEND_CANDIDATE_MUTATION,
          variables: { candidate: JSON.stringify(e.candidate) }
        });
      }
    };
  }

  bind (type: string, callback: Callback): WebRTCDispatcher {
    this.callbacks[type] = this.callbacks[type] || [];
    this.callbacks[type].push(callback);
    return this;
  }

  dispatch (type: string, data: any): void {
    const chain = this.callbacks[type];
    if (typeof chain === 'undefined') return;
    for (let i = 0; i < chain.length; i++) {
      chain[i](data);
    }
  }

  send (type: string, data: any): WebRTCDispatcher {
    const payload = JSON.stringify({ type, data });
    if (this.channel.readyState === 'open') {
      this.channel.send(payload);
    } else {
      this.bind('open', () => this.channel.send(payload));
    }
    return this;
  }

  close (): void {
    this.peer.close();
    this.channel.close();
  }

  receiveCandidate (candidate: RTCIceCandidate): void {
    this.peer.addIceCandidate(candidate)
      .catch(error => console.error(error));
  }

  sendOffer (to: string): void {
    this.peer.createOffer().then(offer => {
      this.peer.setLocalDescription(offer);
      mutate({
        request: SEND_OFFER_MUTATION,
        variables: {
          to,
          offer: JSON.stringify(offer)
        }
      });
    });
  }

  sendAnswer (offer: RTCSessionDescriptionInit, from: string): void {
    this.peer
      .setRemoteDescription(offer)
      .then(() => this.peer.createAnswer())
      .then(answer => {
        mutate({
          request: SEND_ANSWER_MUTATION,
          variables: {
            to: from,
            answer: JSON.stringify(answer)
          }
        });
        this.peer.setLocalDescription(answer);
      });
  }

  receiveAnswer (answer: RTCSessionDescriptionInit): void {
    this.peer.setRemoteDescription(answer);
  }
}

export { WebRTCDispatcher };
