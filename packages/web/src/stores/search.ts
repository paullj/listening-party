import { writable } from 'svelte/store';
import { query } from '../utils/graphqlClient';

const SEARCH_TRACKS_QUERY = `
    query SearchTracks($term: String!) {
      searchTracks(term: $term) {
        title
        artist
        album
        albumCover
        duration
      }
    }
  `;

const createSearch = () => {
  const { subscribe, set } = writable([]);

  const clear = () => set([]);

  const execute = (term) => {
    if (term) {
      query({
        request: SEARCH_TRACKS_QUERY,
        variables: { term }
      }).then(({ searchTracks }) => {
        if (searchTracks) {
          set(searchTracks);
        }
      });
    } else {
      clear();
    }
  };

  return {
    subscribe,
    clear,
    execute
  };
};

export default createSearch();
