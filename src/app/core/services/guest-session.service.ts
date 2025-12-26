import { inject, Injectable, signal } from '@angular/core';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { MovieService } from '../../features/search-page/services/movie.service';
import { GUEST_SESSION_KEY, SESSION_EXPIRY_KEY } from '../Keys/Keys';


@Injectable({
  providedIn: 'root',
})
export class GuestSessionService {
  private readonly movieService = inject(MovieService);
  readonly guestSessionId = signal<string | null>(null);
  readonly isSessionActive = signal(false);

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
