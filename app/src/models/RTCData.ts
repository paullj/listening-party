interface RTCData {
	id: string;
	created: Date;
	userId: string;
}

interface Track extends RTCData {
	title: string;
	artist: string;
	album: string;
	votes?: Vote[];
}

interface Vote extends RTCData {
	trackId: string;
}

interface Message extends RTCData {
	content: string;
}

export type {Track, Vote, Message, RTCData}