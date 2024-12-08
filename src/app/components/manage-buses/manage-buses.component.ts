import { Component } from '@angular/core';
import { AddBusComponent } from '../add-bus/add-bus.component';

@Component({
  selector: 'app-manage-buses',
  standalone: true,
  imports: [AddBusComponent],
  templateUrl: './manage-buses.component.html',
  styleUrl: './manage-buses.component.css'
})
export class ManageBusesComponent {

}
