import { InjectionToken } from '@angular/core';

export const ENVIRONMENT_TOKEN = new InjectionToken<string>('environment');
export const TMDB_BASE_URL = new InjectionToken<string>('TMDB_BASE_URL');
export const TMDB_API_KEY = new InjectionToken<string>('TMDB_API_KEY');
