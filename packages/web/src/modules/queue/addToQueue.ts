import { mutate } from '../../utils/graphqlClient';
import users from '../../stores/users';
import { queue } from '../../stores/queue';
import { searchTerm } from '../../stores/search';
import { PartyEventType } from '../../constants';

const QUEUE_TRACK_MUTATION = `
  mutation AddToQueue($track: AddTrackInput!) {
    addToQueue(track: $track) {
      title,
      artist,
      album,
      albumCover,
      duration,
      provider,
      providerId
    }
  }
`;

export const addToQueue = (track) => {
  mutate({
    request: QUEUE_TRACK_MUTATION,
    variables: {
      track: {
        title: track.title,
        artist: track.artist,
        album: track.album,
        albumCover: track.albumCover,
        duration: track.duration
      }
    }
  }).then(({ addToQueue }) => {
    queue.add(addToQueue);
    users.send(PartyEventType.AddToQueue, addToQueue);
  });
  searchTerm.clear();
};
