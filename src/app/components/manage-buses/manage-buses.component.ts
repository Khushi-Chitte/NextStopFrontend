import { Component, ViewChild } from '@angular/core';
import { AddBusComponent } from '../add-bus/add-bus.component';
import { ViewBusesComponent } from '../view-buses/view-buses.component';

@Component({
  selector: 'app-manage-buses',
  standalone: true,
  imports: [AddBusComponent, ViewBusesComponent],
  templateUrl: './manage-buses.component.html',
  styleUrl: './manage-buses.component.css'
})
export class ManageBusesComponent {
  @ViewChild(ViewBusesComponent) viewBusesComponent!: ViewBusesComponent;

  onBusCreated(): void {
    if (this.viewBusesComponent) {
      this.viewBusesComponent.reloadBuses();
    }
  }

}
