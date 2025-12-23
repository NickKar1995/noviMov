import { Movie } from './Movie';

export type SearchResponse = {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
};
