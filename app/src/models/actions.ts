import { Message, Track } from "./RTCData";

type PeerActionType = keyof PeerActionDataMap;

interface PeerAction {
	type: PeerActionType;
	data: PeerActionDataMap[keyof PeerActionDataMap];
}

type PeerActionData<T extends PeerActionType> = PeerActionDataMap[T];

interface PeerActionIdentifier {
	createdAt: Date;
	createdBy: string;
}

interface PeerActionDataMap {
	Pause: null;
	Play: null;
	NextTrack: null;
	PreviousTrack: null;
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
