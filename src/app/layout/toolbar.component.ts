import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {DashboardService} from '../core/dashboard/dashboard.service';
import {AuthStoreService} from '../core/auth/auth-store.service';
import { MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatToolbar} from '@angular/material/toolbar';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [MatIcon,
    MatToolbar,
    MatIconButton,
    MatMenuTrigger,
    MatMenu,
    MatMenuItem,],
  template: `
    <mat-toolbar class="w-full flex justify-between items-center">
      <div class="flex items-center">
        <button
          (click)="layout.toggleSideNav()"
          mat-icon-button
          aria-label="Example icon-button with menu icon"
        >
          <mat-icon>menu</mat-icon>
        </button>
        <span>Flight Tracker</span>
      </div>
      <div>
        <button
          [matMenuTriggerFor]="menu"
          mat-icon-button
          aria-label="Example icon-button with menu icon"
        >
          <mat-icon>account_circle</mat-icon>
        </button>
      </div>
    </mat-toolbar>
    <mat-menu #menu="matMenu">
      <div mat-menu-item>
        <p>{{ authState.tokenDecoded()?.username }}</p>
        <p>{{ authState.tokenDecoded()?.role }}</p>
      </div>
      <button mat-menu-item (click)="logout()">
        <mat-icon
          aria-hidden="false"
          aria-label="Example home icon"
          fontIcon="logout"
        ></mat-icon>
        <span>Logout</span>
      </button>
    </mat-menu>
  `,

  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToolbarComponent {
  layout = inject(DashboardService);
  authState = inject(AuthStoreService);

  logout() {
    this.authState.logout();
  }
}
