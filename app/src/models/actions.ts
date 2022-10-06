import { Message } from "./message";
import { Track } from "./track";

type PeerActionType = keyof PeerActionDataMap;

interface PeerAction extends PeerActionIdentifier {
	type: PeerActionType;
	hide?: boolean;
	data: PeerActionDataMap[keyof PeerActionDataMap];
}

type PeerActionDataWithIdentifier<T extends keyof PeerActionDataMap> =
	PeerActionIdentifier & { data: PeerActionDataMap[T] };

type PeerActionData<T extends PeerActionType> = PeerActionDataMap[T];

interface PeerActionIdentifier {
	createdAt: Date;
	createdBy: string;
}

type WithIdentifier<T> = PeerActionIdentifier & T;

interface PeerActionDataMap {
	// Player Actions
	Pause: {};
	Play: {};
	NextTrack: {};
	PreviousTrack: {};
	// Queue Actions
	AddTrackToQueue: Track;
	RemoveTrackFromQueue: PeerActionIdentifier;
	// Room Actions
	AddMessage: Message;
	RequestSync: {
		userId: string;
	};
	Sync: PeerAction[];
}

export type {
	PeerActionIdentifier,
	PeerActionType,
	PeerActionData,
	PeerAction,
	PeerActionDataMap,
	WithIdentifier,
	PeerActionDataWithIdentifier,
};
