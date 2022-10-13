import express from "express";

import lastFm from "../../services/lastFm";
import youtube from "../../services/youtube";
import apicache from "apicache";
let cache = apicache.middleware;

const router = express.Router();

router.use("/:query", cache("5 minutes"), async (request, response) => {
  const { query } = request.params;

  const limit = request.query.limit
    ? parseInt(request.query.limit as string)
    : 5;
  const page = request.query.page ? parseInt(request.query.page as string) : 0;

  try {
    const searchResponse = await lastFm.track.search(query as string, {
      limit,
      page,
    });
    const trackPromises = searchResponse.trackMatches.map(async (track) => {
      const lastFmInfo = await lastFm.track.getInfo({
        track: track.name,
        artist: track.artist,
        mbid: track.mbid,
      });
      const videoSearch = await youtube.videos
        .search({
          q: `${track.name} ${track.artist}`,
          maxResults: 1,
        })
        .catch((error) => console.log(error));

      return {
        title: lastFmInfo.name,
        artist: lastFmInfo.artist.name,
        duration: lastFmInfo.duration,
        album: lastFmInfo.album?.title ?? "",
        links: [
          // { provider: "youtube", uri: videoSearch.items[0].id.videoId ?? "" },
        ],
        coverUri: lastFmInfo.album?.image.pop()?.url,
      };
    });

    const tracks = await Promise.all(trackPromises);
    return response.status(200).json({ limit, page, tracks }).end();
  } catch (error) {
    console.log(error);
    return response.status(500).write("Internal server error!");
  }
});

export default router;
