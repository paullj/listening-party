import { isJSON } from "../utils/isJSON";

type DefaultDataMap = {
	Open: {};
	Close: {};
};

type TypeDataMap = {
	[key: string]: any;
};

type ConditionalDataMap<T, D, K extends keyof (T & D)> = K extends keyof D
	? D[K]
	: K extends keyof T
	? T[K]
	: null;

export type Subscriber<T, D, K extends keyof (T & D)> = (
	data: ConditionalDataMap<T, D, K>
) => void;

type SubscriberMap<T, D> = {
	[K in keyof (T & D)]?: Subscriber<T, D, K>[];
};

// A helper class to make working with websockets in Typescript easier
// Create dispatcher with type in following format:
//   type EventType = {
//     EventName: { eventData: string, moreEventData: number }
//     ...
//   }
class WebSocketDispatcher<T extends TypeDataMap> extends WebSocket {
	private subscribers: SubscriberMap<T, DefaultDataMap> = {};

	constructor(url: string) {
		super(url);

		this.onclose = () => {
			this.dispatch("Close", {});
		};

		this.onopen = () => {
			this.dispatch("Open", {});
		};

		this.onmessage = (message) => {
			if (!isJSON(message.data)) {
				console.error("Invalid JSON");
				return;
			}
			let parsedMessage = JSON.parse(message.data);
			console.log(`[SOCKET]: ${parsedMessage.type}`);
			// console.log(`[SOCKET]: ${parsedMessage.type}`, parsedMessage.data);
			this.dispatch(parsedMessage.type, parsedMessage.data);
		};
	}

	subscribe<K extends keyof (T & DefaultDataMap)>(
		type: K,
		subscriber: Subscriber<T, DefaultDataMap, K>
	): () => void {
		this.subscribers[type] = this.subscribers[type] || [];
		if (!this.subscribers[type]?.includes(subscriber)) {
			this.subscribers[type]?.push(subscriber);
			const index = this.subscribers[type]!.length - 1;
			return () => {
				this.subscribers[type]!.splice(index, 1);
			};
		}
		return () => {};
	}

	private dispatch<K extends keyof (T & DefaultDataMap)>(
		type: K,
		data: ConditionalDataMap<T, DefaultDataMap, K>
	): void {
		const chain = this.subscribers[type];
		if (typeof chain === "undefined") return;
		for (let i = 0; i < chain.length; i++) {
			chain[i](data);
		}
	}

	sendEvent<K extends keyof (T & DefaultDataMap)>(
		type: K,
		data: (T & DefaultDataMap)[K]
	): WebSocketDispatcher<T> {
		const payload = JSON.stringify({ type, data });
		if (this.readyState === WebSocket.OPEN) {
			this.send(payload);
		} else {
			const openCallback = () => {
				this.send(payload);
				unsubscribe();
			};
			const unsubscribe = this.subscribe("Open", openCallback);
		}
		return this;
	}

	close(): void {
		super.close();
	}
}
export { WebSocketDispatcher };
