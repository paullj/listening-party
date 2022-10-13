import Youtube from "youtube.ts";

const googleApiKey = process.env.GOOGLE_API_KEY;
if (!googleApiKey) {
  throw "GOOGLE_API_KEY is not set!";
}

const youtube = new Youtube(googleApiKey);

export default youtube;
