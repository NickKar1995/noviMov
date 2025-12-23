import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';

import { routes } from './app.routes';
import { ENVIRONMENT_TOKEN, TMDB_API_KEY, TMDB_BASE_URL } from './core/Tokens/EnvironmentToken';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(withFetch()),
    { provide: ENVIRONMENT_TOKEN, useValue: environment },
    { provide: TMDB_BASE_URL, useValue: environment.tmdb.baseUrl },
    { provide: TMDB_API_KEY, useValue: environment.tmdb.apiKey },
  ],
};
