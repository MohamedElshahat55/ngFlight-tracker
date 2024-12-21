import { ChangeDetectionStrategy, Component } from '@angular/core';
import {DashboardChartTypeEnum} from '../../core/dashboard/dashboard-chart-type-enum';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  template: `
    <div class="h-4"></div>
    <div class="flex items-center justify-between">
      <h2>Dashboard</h2>
    </div>
<!--    <div class="grid grid-cols-2 w-full gap-3">-->
<!--      <app-dashboard-chart-->
<!--        label="Average Price By Ticket Type"-->
<!--        [type]="DashboardChartTypeEnum.AVERAGE_PRICE"-->
<!--        class="w-full"-->
<!--      ></app-dashboard-chart>-->
<!--      <app-dashboard-chart-->
<!--        label="Ticket Sales Over Time"-->
<!--        [type]="DashboardChartTypeEnum.TICKET_SALES"-->
<!--        class="w-full"-->
<!--      ></app-dashboard-chart>-->
<!--    </div>-->
<!--    <div class="w-full">-->
<!--      <app-ticket-deals></app-ticket-deals>-->
<!--    </div>-->
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {
  protected readonly DashboardChartTypeEnum = DashboardChartTypeEnum;
}
