import { writable, derived } from 'svelte/store';
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

const createSearchTerm = () => {
  const { subscribe, set } = writable('');

  const clear = () => set('');

  return {
    subscribe,
    clear,
    set
  };
};

const searchTerm = createSearchTerm();

const createSearchResults = () => {
  return derived(searchTerm, async ($searchTerm) => {
    if ($searchTerm) {
      const { searchTracks } = await query({
        request: SEARCH_TRACKS_QUERY,
        variables: { term: $searchTerm }
      });
      return searchTracks ?? [];
    }
    return [];
  });
};

const searchResults = createSearchResults();

export {
  searchTerm,
  searchResults
};
