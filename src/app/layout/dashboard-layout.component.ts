import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {DashboardService} from '../core/dashboard/dashboard.service';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {ToolbarComponent} from './toolbar.component';
import {
  MatList,
  MatListItem,
  MatListSubheaderCssMatStyler
} from '@angular/material/list';
import {MatIcon} from '@angular/material/icon';
import {MatDrawer, MatDrawerContainer, MatDrawerContent} from '@angular/material/sidenav';
import {MatDivider} from '@angular/material/divider';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [
    MatIcon,
    MatDrawerContainer,
    MatDrawerContent,
    MatDrawer,
    RouterOutlet,
    ToolbarComponent,
    MatList,
    MatListItem,
    MatDivider,
    MatListSubheaderCssMatStyler,
    RouterLink,
    RouterLinkActive,
  ],
  template: `
    <app-toolbar></app-toolbar>
    <mat-drawer-container class="dashboard-height">
      <mat-drawer
        class="h-full"
        (closed)="layout.setSidenav(false)"
        [mode]="layout.sidenavMode()"
        [opened]="layout.sideNavOpened()"
      >
        <div class="bg-white h-full">
          <mat-list role="list">
            @for (section of layout.sidenavContent(); track section) {
              <div mat-subheader>{{ section.title }}</div>
              @for (element of section.children; track element) {
                <mat-list-item
                  class="hover:bg-gray-200"
                  role="listitem"
                  routerLinkActive="!bg-gray-400"
                  [routerLinkActiveOptions]="{ exact: true }"
                  [routerLink]="element.link"
                >
                  <div class="flex items-center">
                    <mat-icon>{{ element.icon }}</mat-icon>
                    <span>{{ element.title }}</span>
                  </div>
                </mat-list-item>
              }
              <mat-divider></mat-divider>
            }
          </mat-list>
        </div>
      </mat-drawer>
      <mat-drawer-content class="overflow-y-scroll h-full">
        <div class="m-4">
          <router-outlet></router-outlet>
        </div>
      </mat-drawer-content>
    </mat-drawer-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardLayoutComponent {
  layout = inject(DashboardService);
}
