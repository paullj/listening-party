interface RTCData {
	createdAt: Date;
	createdBy: string;
}

interface Track extends RTCData {
	title: string;
	artist: string;
	album: string;
	votes?: Vote[];
}

interface Vote extends RTCData {
	trackId: RTCData;
}

interface Message extends RTCData {
	content: string;
}

export type { Track, Vote, Message, RTCData };
