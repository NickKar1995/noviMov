import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/search-page/search-page.component').then((m) => m.SearchPageComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
