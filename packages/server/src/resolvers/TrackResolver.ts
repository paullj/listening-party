import {
  Resolver,
  Arg,
  Authorized,
  Query,
  Mutation,
  Ctx
} from 'type-graphql';

import { Track } from '../entity/Track';
import { spotifyApi } from '../services/spotify';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Repository } from 'typeorm';
import { Context } from '../types/Context';
import { AddTrackInput } from '../types/AddTrackInput';
import { searchForTrack } from '../services/youtube';
// import { AddTrackInput } from './AddTrackInput';
// import { Context } from '../types/Context';
// import { searchForTrack } from '../services/youtube';

@Resolver(() => Track)
class TrackResolver {
  // eslint-disable-next-line no-useless-constructor
  constructor (
    @InjectRepository(Track) private readonly trackRepository: Repository<Track>
  ) { }

  @Authorized()
  @Query(() => [Track])
  async searchTracks (@Arg('term') term: string): Promise<Track[] | null> {
    const spotifyData = await spotifyApi
      .searchTracks(term)
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

  @Authorized()
  @Mutation(() => Track)
  async addToQueue (
    @Arg('track') track: AddTrackInput
  ): Promise<Track> {
    const newTrack = this.trackRepository.create({
      ...track
    });
    if (!newTrack.providerId) {
      const id = await searchForTrack(newTrack.title, newTrack.artist);
      newTrack.provider = 'youtube';
      newTrack.providerId = id;
    }

    // await trackRepository.save(newTrack);

    return newTrack;
  }
}

export { TrackResolver };
