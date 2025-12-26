import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TMDB_API_KEY, TMDB_BASE_URL } from '../Tokens/EnvironmentToken';

/**
 * HTTP Interceptor that automatically adds the TMDB API key to all TMDB API requests.
 * 
 * Only intercepts requests to the TMDB base URL.
 * Adds 'api_key' query parameter if not already present.
 */
export const tmdbApiInterceptor: HttpInterceptorFn = (req, next) => {
  const apiKey = inject(TMDB_API_KEY);
  const baseUrl = inject(TMDB_BASE_URL);

  // Only intercept TMDB API requests
  if (!req.url.startsWith(baseUrl)) {
    return next(req);
  }

  // Check if api_key is already present
  if (req.params.has('api_key')) {
    return next(req);
  }

  // Clone request and add api_key parameter
  const modifiedReq = req.clone({
    params: req.params.set('api_key', apiKey),
  });

  return next(modifiedReq);
};
