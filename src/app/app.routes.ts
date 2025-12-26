import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/search-page/search-page.component').then((m) => m.SearchPageComponent),
  },
  {
    path: 'collections',
    loadComponent: () =>
      import('./features/collections-page/collections-page.component').then(
        (m) => m.CollectionsPageComponent
      ),
  },
  {
    path: 'collections/:id',
    loadComponent: () =>
      import('./features/collections-page/components/collection-details-page/collection-details-page.component').then(
        (m) => m.CollectionDetailsPageComponent
      ),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
