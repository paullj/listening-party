import type { Request, Response } from "express";
import lastFm from "./services/lastFm";

const getSearch = async (request: Request, response: Response) => {
	const { query } = request.params;
	const limit = 5;
	const page = 0;

	try {
		const searchResponse = await lastFm.track.search(query, { limit, page });
		const trackPromises = searchResponse.trackMatches.map(async (track) => {
			return await lastFm.track.getInfo({
				track: track.name,
				artist: track.artist,
				mbid: track.mbid,
			});
		});
		const tracks = await Promise.all(trackPromises);
		return response.status(200).json({ limit, page, tracks }).end();
	} catch (error) {
		console.log(error);
		return response.status(500).write("Internal server error!");
	}
};

export { getSearch };
