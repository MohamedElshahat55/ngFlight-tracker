import { Routes } from '@angular/router';
import { Role } from '../../core/auth/role.enum';

export default [
  {
    path: '',
    providers: [],
    children: [
      // {
      //   path: '',
      //   loadComponent: () => import(),
      // },
      // {
      //   path: 'create',
      //   loadComponent: () => import('./create-ticket/create-ticket.component'),
      //   // canMatch: [authGuard(Role.Admin)],
      // },
    ],
  },
] as Routes;
