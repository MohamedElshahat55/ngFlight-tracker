import {ChangeDetectionStrategy, Component, inject, OnInit, signal} from '@angular/core';
import {Ticket} from '../core/tickets/ticket';
import {TicketService} from '../core/tickets/ticket.service';
import {catchError, of, pipe, switchMap, tap} from 'rxjs';
import {createEffect} from 'ngxtension/create-effect';
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from '@angular/material/card';
import {TicketCardComponent} from '../pattern/ticket-card.component';

@Component({
  selector: 'app-ticket-deals',
  standalone: true,
  imports: [MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    TicketCardComponent,],
  template: `
    <mat-card appearance="outlined" class="my-4 mx-2 w-full">
      <mat-card-header>
        <mat-card-title>Deals</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <div class="grid grid-cols-2">
          @for (ticket of data(); track ticket.id) {
            <app-ticket-card [ticket]="ticket"></app-ticket-card>
          } @empty {
            <p class="m-4">No tickets found</p>
          }
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TicketDelasComponent implements OnInit {
  data = signal<Ticket[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  tickets = inject(TicketService);

  ngOnInit() {
    this.load();
  }

  /**
   * Loads the ticket deals.
   */
  load = createEffect<void>(
    pipe(
      switchMap(() => {
        this.loading.set(true);
        return this.tickets.getTicketDeals().pipe(
          tap((data) => {
            this.loading.set(false);
            this.error.set(null);
            this.data.set(data);
          }),
          catchError(() => {
            this.loading.set(false);
            this.error.set('Something went wrong. Please try again.');
            return of({});
          }),
        );
      }),
    ),
  );
}
