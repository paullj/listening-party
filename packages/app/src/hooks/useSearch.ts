import useSWR from "swr";
import { Track } from "../models/track";
import { useDebounce } from "./useDebounce";

const useSearch = (query: string, delay: number = 200) => {
  const notEmpty = query.trim() !== "";
  const debouncedQuery = useDebounce(query, delay);
  const { data, error } = useSWR(
    notEmpty && debouncedQuery ? `/api/search/${query}` : null,
    (...args) => fetch(...args).then((res) => res.json())
  );

  return {
    isLoading: notEmpty && !error && !data,
    results: (query ? data?.tracks : []) as Track[],
    isError: error,
  };
};

export { useSearch };
