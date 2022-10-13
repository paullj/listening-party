import useSWR from "swr";
import { Track } from "../models/track";
import { useDebounce } from "./useDebounce";

const useSearch = (query: string, delay: number = 200) => {
  const debouncedQuery = useDebounce(query, delay);
  const { data, error } = useSWR(
    query && debouncedQuery ? `/api/search/${query}` : null,
    (...args) => fetch(...args).then((res) => res.json())
  );

  return {
    results: (query ? data?.tracks : []) as Track[],
    isLoading: !error && !data,
    isError: error,
  };
};

export { useSearch };
