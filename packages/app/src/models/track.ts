import { Vote } from "./vote";

interface Track {
	title: string;
	artist: string;
	album: string;
	votes?: Vote[];
}

export type { Track };
