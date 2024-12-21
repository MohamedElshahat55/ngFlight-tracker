import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [],
  template: `
    <p>
      dashboard-layout works!
    </p>
  `,
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardLayoutComponent {

}
