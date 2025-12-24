import { inject, Injectable, signal } from '@angular/core';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { MovieService } from '../../features/search-page/services/movie.service';

const GUEST_SESSION_KEY = 'tmdb_guest_session';
const SESSION_EXPIRY_KEY = 'tmdb_guest_session_expiry';

@Injectable({
  providedIn: 'root',
})
export class GuestSessionService {
  private readonly movieService = inject(MovieService);
  readonly guestSessionId = signal<string | null>(null);
  readonly isSessionActive = signal<boolean>(false);

  constructor() {
    this.loadSessionFromStorage();
  }

  private loadSessionFromStorage(): void {
    const sessionId = localStorage.getItem(GUEST_SESSION_KEY);
    const expiryTime = localStorage.getItem(SESSION_EXPIRY_KEY);

    if (sessionId && expiryTime) {
      const expiry = new Date(expiryTime);
      if (expiry > new Date()) {
        this.guestSessionId.set(sessionId);
        this.isSessionActive.set(true);
      } else {
        this.clearSession();
      }
    }
  }

  createSession(): Observable<boolean> {
    return this.movieService.createGuestSession().pipe(
      tap((response) => {
        if (response.success) {
          this.guestSessionId.set(response.guest_session_id);
          this.isSessionActive.set(true);

          localStorage.setItem(GUEST_SESSION_KEY, response.guest_session_id);
          localStorage.setItem(SESSION_EXPIRY_KEY, response.expires_at);
        }
      }),
      map((response) => response.success),
      catchError(() => of(false)),
    );
  }

  getOrCreateSession(): Observable<string | null> {
    if (this.isSessionActive() && this.guestSessionId()) {
      return of(this.guestSessionId());
    }

    return this.movieService.createGuestSession().pipe(
      tap((response) => {
        if (response.success) {
          this.guestSessionId.set(response.guest_session_id);
          this.isSessionActive.set(true);

          localStorage.setItem(GUEST_SESSION_KEY, response.guest_session_id);
          localStorage.setItem(SESSION_EXPIRY_KEY, response.expires_at);
        }
      }),
      map((response) => (response.success ? response.guest_session_id : null)),
      catchError(() => of(null)),
    );
  }

  clearSession(): void {
    this.guestSessionId.set(null);
    this.isSessionActive.set(false);
    localStorage.removeItem(GUEST_SESSION_KEY);
    localStorage.removeItem(SESSION_EXPIRY_KEY);
  }
}
