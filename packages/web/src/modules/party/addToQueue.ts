import { mutate } from '../../utils/graphqlClient';
import queue from '../../stores/queue';
import users from '../../stores/users';
import search from '../../stores/search';

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
    users.send('addToQueue', addToQueue);
    queue.add(addToQueue);
  });
  search.clear();
};
