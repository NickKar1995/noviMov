import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { RatingResponse } from '../models/RatingResponse';
import { SearchResponse } from '../models/SearchResponse';
import { MovieDetails } from '../models/MovieDetails';
import { GuestSessionResponse } from '../models/GuestSessionResponse';
import { TMDB_BASE_URL } from '../../../core/Tokens/EnvironmentToken';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(TMDB_BASE_URL);

  searchMovies(query: string, page = 1): Observable<SearchResponse> {
    const params = new HttpParams().set('query', query).set('page', page.toString());
    return this.http.get<SearchResponse>(`${this.baseUrl}/search/movie`, { params });
  }

  getMovieDetails(movieId: number): Observable<MovieDetails> {
    return this.http.get<MovieDetails>(`${this.baseUrl}/movie/${movieId}`);
  }

  createGuestSession(): Observable<GuestSessionResponse> {
    return this.http.get<GuestSessionResponse>(`${this.baseUrl}/authentication/guest_session/new`);
  }

  rateMovie(movieId: number, guestSessionId: string, rating: number): Observable<RatingResponse> {
    const params = new HttpParams().set('guest_session_id', guestSessionId);
    return this.http.post<RatingResponse>(
      `${this.baseUrl}/movie/${movieId}/rating`,
      { value: rating },
      { params },
    );
  }

  getImageUrl(path: string | null, size = 'w500'): string {
    if (!path) {
      return 'assets/no-poster.png';
    }
    return `${environment.tmdb.imageBaseUrl}/${size}${path}`;
  }
}
