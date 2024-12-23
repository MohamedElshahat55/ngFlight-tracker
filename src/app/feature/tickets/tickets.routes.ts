import { Routes } from '@angular/router';
import {Role} from '../../core/auth/role.enum';
import {authGuard} from '../../core/auth/auth.guard';

export default [
  {
    path: '',
    providers: [],
    children: [
      {
        path: '',
        loadComponent: () => import('./tickets.component').then(c=>c.TicketsComponent),
      },
      {
        path: 'create',
        loadComponent: () => import('./create-ticket.component').then(c=>c.CreateTicketComponent),
        canMatch: [authGuard(Role.Admin)],
      },
    ],
  },
] as Routes;
