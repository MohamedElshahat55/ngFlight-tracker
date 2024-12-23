import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-ticket-deals',
  standalone: true,
  imports: [],
  template: `
    <p>
      ticket-delas works!
    </p>
  `,
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TicketDelasComponent {

}
