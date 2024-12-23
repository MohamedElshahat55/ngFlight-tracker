import {ChangeDetectionStrategy, Component, effect, inject, Injector, input, signal, viewChild} from '@angular/core';
import {DashboardChartTypeEnum} from '../core/dashboard/dashboard-chart-type-enum';
import {BaseChartDirective} from 'ng2-charts';
import {DataDashboardService} from '../feature/dashboard/data-dashboard.service';
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from '@angular/material/card';
import {MatButton} from '@angular/material/button';
import {MatProgressBar} from '@angular/material/progress-bar';
import {createEffect} from 'ngxtension/create-effect';
import {catchError, map, Observable, of, pipe, switchMap, tap} from 'rxjs';

@Component({
  selector: 'app-dahboard-chart',
  standalone: true,
  imports: [BaseChartDirective,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatButton,
    MatProgressBar,],
  template: `
    <mat-card appearance="outlined" class="my-4 mx-2 w-full">
      <mat-card-header>
        <mat-card-title>{{ label() }}</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <div class="h-10">
          @if (loading()) {
            <mat-progress-bar mode="query"></mat-progress-bar>
          }
        </div>
        @defer (when !loading()) {
          <canvas
            [data]="data()"
            [options]="barChartOptions"
            [type]="barChartType"
            baseChart
          >
          </canvas>
        }
        @if (error()) {
          <p class="m-4">{{ error() }}</p>
          <button mat-flat-button (click)="this.load()">Retry</button>
        }
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
export class DahboardChartComponent {
  type = input.required<DashboardChartTypeEnum>();
  label = input<string>('');
  loading = signal(false);
  error = signal<string | null>(null);
  data = signal({ labels: [], datasets: [] });
  chart = viewChild(BaseChartDirective);
  dashboard = inject(DataDashboardService);

  barChartOptions: any = {
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      x: {},
      y: {
        min: 10,
      },
    },
    plugins: {
      legend: {
        display: true,
      },
    },
  };

  barChartType = 'bar' as const;

  constructor() {
    effect(
      () => {
        const chart = this.chart();
        if (chart && this.data()) {
          chart.update();
        }
      },
    );
  }

  ngOnInit() {
    this.load();
  }

  /**
   * Loads the chart data based on the chart type.
   */
  load = createEffect<void>(
    pipe(
      switchMap(() => {
        this.loading.set(true);
        return this.getDataByType().pipe(
          tap((data) => {
            this.loading.set(false);
            this.error.set(null);
            this.data.set(data as any);
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

  /**
   * Fetches the data based on the type of chart.
   * @returns {Observable<ChartData<'bar'>>} An observable containing the chart data.
   */
  getDataByType(): Observable<any> {
    switch (this.type()) {
      case DashboardChartTypeEnum.AVERAGE_PRICE:
        console.log('average price');
        return this.dashboard.getAveragePriceByTicketType().pipe(
          map(
            (data) =>
              ({
                labels: Object.keys(data),
                datasets: [
                  {
                    data: Object.keys(data).map((key) => data[key]),
                    label: this.label(),
                  },
                ],
              }) as any
          ),
        );
      case DashboardChartTypeEnum.TICKET_SALES:
        console.log('ticket sales');
        return this.dashboard.getTicketSalesOverTime().pipe(
          map(
            (data) =>
              ({
                labels: Object.keys(data),
                datasets: [
                  {
                    data: Object.keys(data).map((key) => data[key]),
                    label: this.label(),
                  },
                ],
              }) as any
          ),
        );
      default:
        return of({
          labels: [],
          datasets: [],
        });
    }
  }

}
