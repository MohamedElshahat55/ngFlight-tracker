import { Routes } from '@angular/router';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import {DashboardService} from '../../core/dashboard/dashboard.service';

export default [
  {
    path: '',
    providers: [
      DashboardService,
      provideCharts(withDefaultRegisterables())
    ],
    children: [
      {
        path: '',
        loadComponent: () => import('./dashboard.component').then(m => m.DashboardComponent),
      },
    ],
  },
] as Routes;
