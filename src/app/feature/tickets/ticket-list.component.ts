import {ChangeDetectionStrategy, Component, input, output} from '@angular/core';
import {Ticket} from '../../core/tickets/ticket';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {TicketCardComponent} from '../../pattern/ticket-card.component';

@Component({
  selector: 'app-ticket-list',
  standalone: true,
  imports: [TicketCardComponent, MatPaginator],
  template: `
    <div class="grid grid-cols-2">
      @for (ticket of data(); track ticket.id) {
        <app-ticket-card [ticket]="ticket"></app-ticket-card>
      } @empty {
        <p class="m-4">No tickets found</p>
      }
    </div>
    <mat-paginator
      [length]="total()"
      [pageSize]="pageSize()"
      [pageIndex]="page()"
      [pageSizeOptions]="[5, 10, 25, 100]"
      (page)="pageChange.emit($event)"
      aria-label="Select page"
    >
    </mat-paginator>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TicketListComponent {
  /**
   * The list of tickets to display.
   */
  data = input.required<Ticket[]>();

  /**
   * The current page size.
   */
  pageSize = input.required<number>();

  /**
   * The current page index.
   */
  page = input.required<number>();

  /**
   * The total number of tickets.
   */
  total = input.required<number>();

  /**
   * The total number of tickets.
   */
  pageChange = output<PageEvent>();
}
