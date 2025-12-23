export type Movie = {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
  overview: string;
  release_date: string;
  budget: number;
  revenue: number;
  vote_count: number;
};

export type MovieDetails = Movie & {
  spoken_languages: SpokenLanguage[];
};

export type SpokenLanguage = {
  english_name: string;
  iso_639_1: string;
  name: string;
};

export type SearchResponse = {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
};

export type GuestSessionResponse = {
  success: boolean;
  guest_session_id: string;
  expires_at: string;
};

export type RatingResponse = {
  success: boolean;
  status_code: number;
  status_message: string;
};
