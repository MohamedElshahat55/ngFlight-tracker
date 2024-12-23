import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {TicketListComponent} from './ticket-list.component';
import {MatButton} from '@angular/material/button';
import {Router, RouterLink} from '@angular/router';
import {RoleDirective} from '../../core/auth/role.directive';
import {MatCard, MatCardContent} from '@angular/material/card';
import {MatProgressBar} from '@angular/material/progress-bar';
import {TicketListStore} from './tickets.store';
import {Role} from '../../core/auth/role.enum';
import {injectQueryParams} from 'ngxtension/inject-query-params';
import {MatSnackBar} from '@angular/material/snack-bar';
import {explicitEffect} from 'ngxtension/explicit-effect';
import {PageEvent} from '@angular/material/paginator';
import {TicketListParams} from '../../core/tickets/ticket-state';

@Component({
  selector: 'app-tickets',
  standalone: true,
  imports: [MatButton,
    RouterLink,
    RoleDirective,
    MatCard,
    MatCardContent,
    TicketListComponent,
    MatProgressBar,],
  template: `
    <div class="h-4">
      @if (store.loading()) {
        <mat-progress-bar mode="query"></mat-progress-bar>
      }
    </div>

    <div class="flex items-center justify-between my-2">
      <h2>Tickets</h2>
      <button mat-flat-button *role="Role.Admin" [routerLink]="['create']">
        Create Ticket
      </button>
    </div>

    <mat-card class="my-4" appearance="outlined">
      <mat-card-content>
        <app-ticket-list
          [page]="store.params().page"
          [pageSize]="store.params().pageSize"
          [total]="store.total()"
          (pageChange)="onPagination($event)"
          [data]="store.data()"
        ></app-ticket-list>
      </mat-card-content>
    </mat-card>
  `,

 providers:[TicketListStore],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TicketsComponent {
  Role = Role;

  queryParams = injectQueryParams();
  router = inject(Router);
  store = inject(TicketListStore);
  snackBar = inject(MatSnackBar);

  constructor() {
    explicitEffect([this.store.state], ([state]) => {
      if (state.error) {
        this.snackBar.open(state.error, 'Close', {
          duration: 5000,
        });
      }
    });
  }

  ngOnInit() {
    this.store.load({
      page: this.queryParams()['_page']
        ? Number(this.queryParams()['_page'])
        : 0,
      pageSize: this.queryParams()['_limit']
        ? Number(this.queryParams()['_limit'])
        : 10,
      from_date: this.queryParams()['from_date'],
      to_date: this.queryParams()['to_date'],
      inbound: this.queryParams()['inbound'],
      outbound: this.queryParams()['outbound'],
      from_price: this.queryParams()['from_price'],
      to_price: this.queryParams()['to_price'],
    });
  }

  /**
   * Handles pagination events.
   * @param {PageEvent} event - The pagination event.
   */
  onPagination(event: PageEvent) {
    this.router.navigate([], {
      queryParams: {
        _page: event.pageIndex + 1,
        _limit: event.pageSize,
      },
      queryParamsHandling: 'merge',
    });
    this.store.load({ page: event.pageIndex, pageSize: event.pageSize });
  }

  /**
   * Handles search events.
   * @param {Partial<TicketListParams>} event - The search event parameters.
   */
  onSearch(event: Partial<TicketListParams>) {
    this.router.navigate([], {
      queryParams: {
        from_date: event.from_date,
        to_date: event.to_date,
        inbound: event.inbound,
        outbound: event.outbound,
        from_price: event.from_price,
        to_price: event.to_price,
      },
      queryParamsHandling: 'merge',
    });
    this.store.load(event);
  }
}
