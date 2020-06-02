import { dispatcher } from './WebSocketDispatcher';

type Callback = (data: {}) => void;

class WebRTCDispatcher {
  peer: RTCPeerConnection;
  channel: RTCDataChannel;
  callbacks: { [key: string]: Callback[] } = {};

  constructor () {
    this.peer = new RTCPeerConnection();
    this.channel = this.peer.createDataChannel('message', {
      negotiated: true,
      id: 0
    });

    this.peer.onicecandidate = e => {
      !e.candidate ||
      dispatcher.send('send-candidate', {
        type: 'send-candidate',
        candidate: e.candidate
      });
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

    this.channel.onclose = () => {
      this.dispatch('close', null);
    };
    this.channel.onopen = () => {
      this.dispatch('open', null);
    };
  }

  bind (type: string, callback: Callback) {
    this.callbacks[type] = this.callbacks[type] || [];
    this.callbacks[type].push(callback);
    return this;
  }

  dispatch (type: string, message) {
    const chain = this.callbacks[type];
    if (typeof chain === 'undefined') return;
    for (var i = 0; i < chain.length; i++) {
      chain[i](message);
    }
  }

  send (type: string, data: {}) {
    var payload = JSON.stringify({ type, data });
    if (this.channel.readyState === 'connecting') {
      this.bind('open', () => this.channel.send(payload));
    } else {
      this.channel.send(payload);
    }
    return this;
  }

  close () {
    this.peer.close();
    this.channel.close();
  }

  receiveCandidate (candidate: RTCIceCandidate) {
    this.peer.addIceCandidate(candidate)
      .catch(error => console.error(error));
  }

  sendOffer (to: string) {
    // Sets the local desc and then send the offer to a signalling server
    this.peer.createOffer().then(offer => {
      this.peer.setLocalDescription(offer);

      dispatcher.send('send-offer', {
        to,
        offer
      });
    });
  }

  receiveOffer (offer: RTCSessionDescriptionInit, from: string) {
    this.peer
      .setRemoteDescription(offer)
      .then(() => this.peer.createAnswer())
      .then(answer => {
        this.peer.setLocalDescription(answer);
        dispatcher.send('send-answer', {
          to: from,
          answer
        });
      });
  }

  receiveAnswer (answer: RTCSessionDescriptionInit) {
    this.peer.setRemoteDescription(answer);
  }
}

export { WebRTCDispatcher };
