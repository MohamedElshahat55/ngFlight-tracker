import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'sign-in',
    loadChildren: () => import('./feature/sign-in/sign-in.routes'),
  },
];
