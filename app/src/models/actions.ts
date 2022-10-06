import { Message } from "./message";
import { Track } from "./track";

type PeerActionType = keyof PeerActionDataMap;

interface PeerAction extends PeerActionIdentifier {
	type: PeerActionType;
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
	Pause: {};
	Play: {};
	NextTrack: {};
	PreviousTrack: {};
	AddTrackToQueue: Track;
	RemoveTrackFromQueue: PeerActionIdentifier;
	AddMessage: Message;
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
