import { Vote } from "./vote";

interface Track {
  title: string;
  artist: string;
  album: string;
  votes?: Vote[];
  uri?: string;
  coverUri?: string;
  duration: number;
}

export type { Track };
