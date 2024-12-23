import {TicketListParams, TicketListState} from '../../core/tickets/ticket-state';
import {getState, patchState, signalStore, withMethods, withState} from '@ngrx/signals';
import {inject} from '@angular/core';
import {TicketService} from '../../core/tickets/ticket.service';
import {rxMethod} from '@ngrx/signals/rxjs-interop';
import {catchError, EMPTY, pipe, switchMap, tap} from 'rxjs';

const initialState: TicketListState = {
  data: [],
  params: {
    page: 0,
    pageSize: 10,
    from_date: null,
    to_date: null,
    inbound: null,
    outbound: null,
    from_price: null,
    to_price: null,
  },
  total: 0,
  loaded: false,
  loading: false,
  error: null,
};

export const TicketListStore = signalStore(
  withState(initialState),
  withMethods((store, ticketsService = inject(TicketService)) => ({
    /**
     * Gets the current state of the store.
     * @returns {TicketListState} The current state.
     */
    state: (): TicketListState => {
      return getState(store);
    },
    /**
     * Loads the tickets based on the provided parameters.
     * @param {Partial<TicketListParams>} params - The parameters for loading tickets.
     * @returns {void}
     */
    load: rxMethod<Partial<TicketListParams>>(
      pipe(
        tap(() => patchState(store, { loading: true })),
        switchMap((params: Partial<TicketListParams>) => {
          const newParams = { ...getState(store).params, ...params };
          return ticketsService.getTickets(newParams).pipe(
            tap({
              next: (response) => {
                patchState(store, {
                  data: response.body ?? [],
                  total: Number(response.headers.get('X-Total-Count')),
                  loaded: true,
                  loading: false,
                  error: null,
                  params: newParams,
                });
              },
            }),
            catchError((e) => {
              console.log(e);
              patchState(store, {
                error: 'Error loading tickets',
                loaded: false,
                loading: false,
              });
              return EMPTY;
            }),
          );
        }),
      ),
    ),
  })),
);
