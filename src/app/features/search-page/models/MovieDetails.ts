import { Movie } from './Movie';
import { SpokenLanguage } from './SpokenLanguge';

export type MovieDetails = Movie & {
  spoken_languages: SpokenLanguage[];
};
