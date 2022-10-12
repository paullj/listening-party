import LastFMTyped from "lastfm-typed";

const lastFmApiKey = process.env.LASTFM_API_KEY;
if (!lastFmApiKey) {
	throw "LASTFM_API_KEY is not set!";
}
const lastFm = new LastFMTyped(lastFmApiKey);

export default lastFm;
