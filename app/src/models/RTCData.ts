interface RTCData {
	createdAt: Date;
	createdBy: string;
}

interface Track {
	title: string;
	artist: string;
	album: string;
	votes?: Vote[];
}

interface Vote {
	trackId: RTCData;
}

interface Message {
	content: string;
}

export type { Track, Vote, Message, RTCData };
