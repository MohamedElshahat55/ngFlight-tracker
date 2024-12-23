import { ChangeDetectionStrategy, Component } from '@angular/core';
import {DashboardChartTypeEnum} from '../../core/dashboard/dashboard-chart-type-enum';
import {TicketDelasComponent} from '../../layout/ticket-delas.component';
import {DahboardChartComponent} from '../../layout/dahboard-chart.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DahboardChartComponent, TicketDelasComponent, ],
  template: `
    <div class="h-4"></div>
    <div class="flex items-center justify-between">
      <h2>Dashboard</h2>
    </div>
    <div class="grid grid-cols-2 w-full gap-3">
      <app-dahboard-chart
        label="Average Price By Ticket Type"
        [type]="DashboardChartTypeEnum.AVERAGE_PRICE"
        class="w-full"
      ></app-dahboard-chart>
      <app-dahboard-chart
        label="Ticket Sales Over Time"
        [type]="DashboardChartTypeEnum.TICKET_SALES"
        class="w-full"
      ></app-dahboard-chart>
    </div>
    <div class="w-full">
      <app-ticket-deals></app-ticket-deals>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {
  protected readonly DashboardChartTypeEnum = DashboardChartTypeEnum;
}
