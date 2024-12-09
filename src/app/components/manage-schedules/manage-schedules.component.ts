import { Component, ViewChild } from '@angular/core';
import { CreateScheduleComponent } from "../create-schedule/create-schedule.component";
import { ViewSchedulesComponent } from "../view-schedules/view-schedules.component";

@Component({
  selector: 'app-manage-schedules',
  standalone: true,
  imports: [CreateScheduleComponent, ViewSchedulesComponent],
  templateUrl: './manage-schedules.component.html',
  styleUrl: './manage-schedules.component.css'
})
export class ManageSchedulesComponent {
  @ViewChild(ViewSchedulesComponent) viewSchedulesComponent!: ViewSchedulesComponent;

  onScheduleCreated(): void {
    if (this.viewSchedulesComponent) {
      this.viewSchedulesComponent.reloadSchedules();
    }
  }

}
