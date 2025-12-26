import { Movie } from "../../search-page/models/Movie";

export type MovieCollection = {
  id: string;
  title: string;
  description: string;
  movies: Movie[];
  createdAt: string;
  updatedAt: string;
};
