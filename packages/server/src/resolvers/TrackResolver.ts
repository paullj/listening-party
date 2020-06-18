/* eslint-disable class-methods-use-this */
import {
  Resolver,
  Arg,
  Authorized,
  Query
} from 'type-graphql';

import { Track } from '../entity/Track';
import { spotifyApi } from '../services/spotify';
// import { AddTrackInput } from './AddTrackInput';
// import { Context } from '../types/Context';
// import { searchForTrack } from '../services/youtube';

@Resolver(() => Track)
class TrackResolver {
  @Authorized()
  @Query(() => [Track])
  async searchTracks (@Arg('query') query: string): Promise<Track[] | null> {
    const spotifyData = await spotifyApi
      .searchTracks(query)
      .then((response) => {
        if (response.statusCode === 200) return response.body.tracks?.items;
        return undefined;
      });
    if (spotifyData) {
      return spotifyData.map((x) => {
        const track = new Track();
        track.title = x.name;
        track.artist = x.artists.map((a) => a.name).join(', ');
        track.album = x.album.name;
        track.albumCover = x.album.images.sort(
          (a, b) => (a.width ?? 10000) - (b.width ?? 10000)
        )[0].url;
        track.duration = x.duration_ms;
        return track;
      });
    }

    return null;
  }
}

export { TrackResolver };
