import { Message, Track } from "./RTCData";

type PeerActionType = keyof PeerActionDataMap;

interface PeerAction extends PeerActionIdentifier {
	type: PeerActionType;
	data: PeerActionDataMap[keyof PeerActionDataMap];
}

type PeerActionData<T extends PeerActionType> = PeerActionDataMap[T];

interface PeerActionIdentifier {
	createdAt: Date;
	createdBy: string;
}

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
};
