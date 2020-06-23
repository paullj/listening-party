import { writable, derived } from 'svelte/store';

const QUEUE_TRACK_MUTATION = `
  mutation AddToQueue($track: AddTrackInput!, $roomId: String!) {
    addToQueue(track: $track, roomId: $roomId)
  }
`;

const createQueue = () => {
  const { subscribe, set, update } = writable([], () => {
    return () => {
      //
    };
  });

  const add = (track) => {
    update((data) => [...data, track]);

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

  return {
    subscribe,
    add,
    set
  };
};
export const queue = createQueue();
export const nowPlaying = derived(queue, $queue => $queue[0]);
