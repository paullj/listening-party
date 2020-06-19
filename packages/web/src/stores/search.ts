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
  const { subscribe, set } = writable([], () => {
    return () => {
      //
    };
  });

  const clear = () => set([]);

  const execute = (term) => {
    if (term) {
      query(SEARCH_TRACKS_QUERY, { variables: { term } })
        .then((response) => {
          if (response.data) {
            set(response.data.searchTracks);
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
