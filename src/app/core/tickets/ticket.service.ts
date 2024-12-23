import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams, HttpResponse} from '@angular/common/http';
import {TicketListParams} from './ticket-state';
import {Observable} from 'rxjs';
import {Ticket} from './ticket';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  http = inject(HttpClient);

  /*
  //?================== INPUTS=========================
      * const params: TicketListParams = {
      page: 1,
      pageSize: 10,
      from_date: '2023-01-01',
      to_date: '2023-12-31',
      inbound: 'Cairo',
      outbound: 'Dubai',
      from_price: 100,
      to_price: 500,
    };

    //?================== OUTPUTS=========================
    _page=1&_limit=10&from_date_gte=1/1/2023&to_date_lte=12/31/2023&inbound_like=Cairo&outbound_like=Dubai&price_gte=100&price_lte=500
  * */

  /**
   * Fetches tickets based on the provided parameters.
   * @param {TicketListParams} params - The parameters for fetching tickets.
   * @returns {Observable<HttpResponse<Ticket[]>>} An observable containing the list of tickets.
   */
  getTickets(params: TicketListParams): Observable<HttpResponse<Ticket[]>> {
    const path = `${environment.apiUrl}/tickets`;
    return this.http.get<Ticket[]>(path, {
      observe: 'response',
      params: this.getParams(params),
    });
  }

  /**
   * Converts TicketListParams into HttpParams.
   * @param {TicketListParams} params - The parameters to convert.
   * @returns {HttpParams} The converted HttpParams object.
   */
  private getParams(params: TicketListParams): HttpParams {
    let httpParams = new HttpParams()
      .set('_page', params.page.toString())
      .set('_limit', params.pageSize.toString());

    if (params.from_date) {
      httpParams = httpParams.set(
        'from_date_gte',
        new Date(params.from_date).toLocaleDateString(),
      );
    }
    if (params.to_date) {
      httpParams = httpParams.set(
        'to_date_lte',
        new Date(params.to_date).toLocaleDateString(),
      );
    }
    if (params.inbound) {
      httpParams = httpParams.set('inbound_like', params.inbound);
    }
    if (params.outbound) {
      httpParams = httpParams.set('outbound_like', params.outbound);
    }
    if (params.from_price !== null && params.from_price !== undefined) {
      httpParams = httpParams.set('price_gte', params.from_price.toString());
    }
    if (params.to_price !== null && params.to_price !== undefined) {
      httpParams = httpParams.set('price_lte', params.to_price.toString());
    }

    return httpParams;
  }

  /**
   * Fetches ticket deals.
   * @returns {Observable<Ticket[]>} An observable containing the list of ticket deals.
   */
  getTicketDeals(): Observable<Ticket[]> {
    const path = `${environment.apiUrl}/tickets`;
    return this.http.get<Ticket[]>(path, {
      params: new HttpParams({
        fromObject: {
          _limit: '6',
          _sort: 'price',
          _order: 'asc',
        },
      }),
    });
  }

  /**
   * Creates a new ticket.
   * @param {Ticket} ticket - The ticket to create.
   * @returns {Observable<Ticket>} An observable containing the created ticket.
   */
  createTicket(ticket: Ticket): Observable<Ticket> {
    const path = `${environment.apiUrl}/tickets`;
    return this.http.post<Ticket>(path, ticket);
  }

}
