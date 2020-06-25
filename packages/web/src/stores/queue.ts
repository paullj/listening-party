import { writable } from 'svelte/store';

const QUEUE_TRACK_MUTATION = `
  mutation AddToQueue($track: AddTrackInput!, $roomId: String!) {
    addToQueue(track: $track, roomId: $roomId)
  }
`;

const createNowPlaying = () => {
  const { subscribe, set } = writable(null);

  return {
    subscribe,
    set
  };
};

export const nowPlaying = createNowPlaying();

const createQueue = () => {
  const { subscribe, set, update } = writable([]);

  const add = (track) => {
    update((data) => {
      return [...data, track];
    });

    // getClient()
    //   .mutation(QUEUE_TRACK_MUTATION, {
    //     track: {
    //       title: track.title,
    //       artist: track.artist,
    //       album: track.album,
    //       albumCover: track.albumCover,
    //       duration: track.duration
    //     },
    //     roomId: id
    //   })
    //   .toPromise()
    //   .then((response) => {
    //     if (response.error) {
    //       console.error(response.error.message);
    //     }
    //     if (response.data) {
    //       // FIXME: Maybe set to the correct value afterwards?
    //       // update((data) => [...data, track]);
    //     }
    //   });
  };

  const next = () => {
    update((data) => {
      if (data.length > 0) {
        const newCurrent = data[0];
        nowPlaying.set(newCurrent);
        return data.slice(1);
      } else {
        nowPlaying.set({});
        return [];
      }
    });
  };

  return {
    subscribe,
    set,
    add,
    next
  };
};
export const queue = createQueue();
