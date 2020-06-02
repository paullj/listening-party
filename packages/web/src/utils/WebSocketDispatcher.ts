
type WebSocketCallback = (data: {}) => void;

// TODO: Typescriptify this
const WebSocketDispatcher = function (url: string) {
  var socket = new WebSocket(url);

  var callbacks: { [key: string]: WebSocketCallback[] } = {};

  this.bind = function (type: string, callback: WebSocketCallback) {
    callbacks[type] = callbacks[type] || [];
    callbacks[type].push(callback);
    return this;
  };

  this.send = function (type: string, data: {}) {
    var payload = JSON.stringify({ type, data });
    if (socket.readyState === socket.CONNECTING) {
      this.bind('open', () => socket.send(payload));
    } else {
      socket.send(payload);
    }
    return this;
  };

  this.close = function () {
    socket.close();
  };

  socket.onmessage = function (message) {
    let json: { type?: string; data?: any; };
    try {
      json = JSON.parse(message.data);
    } catch (e) {
      console.error('Invalid JSON');
      json = {};
    }
    dispatch(json.type, json.data);
  };

  socket.onclose = function () { dispatch('close', null); };
  socket.onopen = function () { dispatch('open', null); };

  const dispatch = function (type: string, message) {
    const chain = callbacks[type];
    if (typeof chain === 'undefined') return;
    for (var i = 0; i < chain.length; i++) {
      chain[i](message);
    }
  };
};

// export default WebSocketDispatcher;

const dispatcher = new WebSocketDispatcher('ws://127.0.0.1:4000');

export { dispatcher };
