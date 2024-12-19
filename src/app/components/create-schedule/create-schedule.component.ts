import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiServiceService } from '../../services/api-service.service';
import { AuthserviceService } from '../../services/authservice.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-create-schedule',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-schedule.component.html',
  styleUrls: ['./create-schedule.component.css']
})
export class CreateScheduleComponent implements OnInit {
  createScheduleForm!: FormGroup;
  recurrenceOptions: string[] = ['None', 'Daily', 'Weekly', 'Custom'];
  errorMessage: string = '';
  successMessage: string = '';
  isSubmitting: boolean = false;
  isAdmin: boolean = false;
  operatorId: number = 0;
  operatorBuses: { busId: number, busNumber: string, operatorName: string, busName: string }[] = [];
  allBuses: { busId: number, busNumber: string, operatorName: string, busName: string }[] = [];
  routes: any[] = [];
  minDate: string;

  @Output() scheduleCreated = new EventEmitter<void>();

  constructor(private apiService: ApiServiceService, private authService: AuthserviceService) {
    this.minDate = new Date().toISOString().split('T')[0];  // Set minimum date to today
  }

  ngOnInit(): void {
    this.isAdmin = this.authService.getUserRoles() === 'admin';
    this.operatorId = parseInt(localStorage.getItem('userId') ?? '0');
    console.log(this.isAdmin, `creating schedule with operatorId: ${this.operatorId}`);

    if (this.isAdmin) {
      this.fetchAllBuses();
    } else {
      this.fetchOperatorBuses();
    }

    this.fetchAllRoutes();

    this.createScheduleForm = new FormGroup({
      busId: new FormControl(null, [Validators.required]),
      routeId: new FormControl(null, [Validators.required]),
      departureDate: new FormControl('', [Validators.required]),
      departureTime: new FormControl('', [Validators.required]),
      arrivalDate: new FormControl('', [Validators.required]),
      arrivalTime: new FormControl('', [Validators.required]),
      fare: new FormControl(0, [Validators.required, Validators.min(1)]),
      recurrence: new FormControl('None', Validators.required),
      recurrenceCount: new FormControl(0, [Validators.min(1), Validators.max(30)]),
      monday: new FormControl(false),
      tuesday: new FormControl(false),
      wednesday: new FormControl(false),
      thursday: new FormControl(false),
      friday: new FormControl(false),
      saturday: new FormControl(false),
      sunday: new FormControl(false)
    });
  }

  fetchOperatorBuses(): void {
    this.apiService.fetchBusesByOperatorId().subscribe({
      next: (buses: any) => {
        this.operatorBuses = buses.map((bus: any) => ({
          busId: bus.busId,
          busNumber: bus.busNumber,
          operatorName: bus.operatorName,
          busName: bus.busName
        }));
        console.log('Operator Buses:', this.operatorBuses);
      },
      error: (error: any) => this.handleError(error)
    });
  }

  fetchAllBuses(): void {
    this.apiService.fetchAllBuses().subscribe({
      next: (buses: any) => {
        this.allBuses = buses.map((bus: any) => ({
          busId: bus.busId,
          busNumber: bus.busNumber,
          operatorName: bus.operatorName,
          busName: bus.busName
        }));
        console.log('All Buses for Admin:', this.allBuses);
      },
      error: (error: any) => this.handleError(error)
    });
  }

  fetchAllRoutes(): void {
    this.apiService.fetchAllRoutes().subscribe({
      next: (routes: any) => {
        this.routes = routes;
        console.log('Available Routes:', this.routes);
      },
      error: (error: any) => this.handleError(error)
    });
  }

  generateRecurrenceSchedules(recurrence: string, count: number, baseSchedule: any): any[] {
    const schedules = [];
    let departureDate = new Date(baseSchedule.departureDateTime);
    let arrivalDate = new Date(baseSchedule.arrivalDateTime);

    // Recurrence logic for each type
    if (recurrence === 'Daily') {
      for (let i = 0; i < count; i++) {
        const schedule = {
          departureDateTime: departureDate.toISOString(),
          arrivalDateTime: arrivalDate.toISOString(),
          departureDate: baseSchedule.departureDate
        };
        schedules.push(schedule);
        departureDate.setDate(departureDate.getDate() + 1);
        arrivalDate.setDate(arrivalDate.getDate() + 1);
      }
    } else if (recurrence === 'Weekly') {
      for (let i = 0; i < count; i++) {
        const schedule = {
          departureDateTime: departureDate.toISOString(),
          arrivalDateTime: arrivalDate.toISOString(),
          departureDate: baseSchedule.departureDate
        };
        schedules.push(schedule);
        departureDate.setDate(departureDate.getDate() + 7);
        arrivalDate.setDate(arrivalDate.getDate() + 7);
      }
    } else if (recurrence === 'Custom') {
      // Handle custom days (Monday, Tuesday, Wednesday, etc.)
      const selectedDays: number[] = [];
      if (baseSchedule.monday) selectedDays.push(1); // Monday
      if (baseSchedule.tuesday) selectedDays.push(2); // Tuesday
      if (baseSchedule.wednesday) selectedDays.push(3); // Wednesday
      if (baseSchedule.thursday) selectedDays.push(4); // Thursday
      if (baseSchedule.friday) selectedDays.push(5); // Friday
      if (baseSchedule.saturday) selectedDays.push(6); // Saturday
      if (baseSchedule.sunday) selectedDays.push(0); // Sunday

      let dayIndex = 0;
      let daysAdded = 0;

      while (daysAdded < count) {
        // Check if the current day is one of the selected days
        if (selectedDays.includes(departureDate.getDay())) {
          const schedule = {
            departureDateTime: departureDate.toISOString(),
            arrivalDateTime: arrivalDate.toISOString(),
            departureDate: baseSchedule.departureDate
          };
          schedules.push(schedule);
          daysAdded++;
        }
        // Move to the next day
        departureDate.setDate(departureDate.getDate() + 1);
        arrivalDate.setDate(arrivalDate.getDate() + 1);
      }
    }

    return schedules;
  }

  onRecurrenceChange(): void {
    const recurrenceType = this.createScheduleForm.get('recurrence')?.value;
    if (recurrenceType !== 'Custom') {
      this.createScheduleForm.patchValue({
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
        sunday: false
      });
    }
  }

  onCreateSchedule(): void {
    const formValues = { ...this.createScheduleForm.value };
    const departureDateTime = new Date(
      `${formValues.departureDate}T${formValues.departureTime}:00`
    );
    const arrivalDateTime = new Date(
      `${formValues.arrivalDate}T${formValues.arrivalTime}:00`
    );
  
    // Convert both dates to ISO string in the local timezone
    const departureDateTimeLocal = departureDateTime.toISOString();
    const arrivalDateTimeLocal = arrivalDateTime.toISOString();
  
    const schedules = this.generateRecurrenceSchedules(
      formValues.recurrence,
      formValues.recurrenceCount,
      {
        departureDateTime,
        arrivalDateTime,
        departureDate: formValues.departureDate,
        monday: formValues.monday,
        tuesday: formValues.tuesday,
        wednesday: formValues.wednesday,
        thursday: formValues.thursday,
        friday: formValues.friday,
        saturday: formValues.saturday,
        sunday: formValues.sunday
      }
    );
  
    this.isSubmitting = true;
  
    // Fetch existing schedules for the selected bus
    this.apiService.fetchSchedulesByBusId(formValues.busId).subscribe({
      next: (existingSchedules: any) => {
        const hasOverlap = this.checkForScheduleOverlap(existingSchedules, schedules);
        if (hasOverlap) {
          this.errorMessage = 'The selected bus has an overlapping schedule at the given time.';
          this.isSubmitting = false;
          return;
        }
  
        // No overlap, proceed with schedule creation
        const requests = schedules.map(schedule => {
          return this.apiService.createSchedule({
            busId: Number(formValues.busId),
            routeId: Number(formValues.routeId),
            departureTime: schedule.departureDateTime,
            arrivalTime: schedule.arrivalDateTime,
            fare: formValues.fare,
            date: schedule.departureDate
          });
        });

        console.log(schedules);
  
        forkJoin(requests).subscribe({
          next: () => {
            this.successMessage = 'All schedules created successfully!';
            this.scheduleCreated.emit();
            this.createScheduleForm.reset();
          },
          error: (error: any) => this.handleError(error),
          complete: () => (this.isSubmitting = false)
        });
      },
      error: (error: any) => this.handleError(error)
    });
  }

  checkForScheduleOverlap(existingSchedules: any[], newSchedules: any[]): boolean {
    return newSchedules.some(newSchedule => {
      return existingSchedules.some(existingSchedule => {
        const existingStart = new Date(existingSchedule.departureTime).getTime();
        const existingEnd = new Date(existingSchedule.arrivalTime).getTime();
        const newStart = new Date(newSchedule.departureDateTime).getTime();
        const newEnd = new Date(newSchedule.arrivalDateTime).getTime();
  
        // Check for overlap
        return (newStart < existingEnd && newEnd > existingStart);
      });
    });
  }

  handleError(error: any): void {
    this.errorMessage = error?.error?.message || 'An unexpected error occurred. Please try again later.';
    console.error(this.errorMessage, error);
  }
}
