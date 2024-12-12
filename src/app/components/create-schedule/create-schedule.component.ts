import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiServiceService } from '../../services/api-service.service';
import { AuthserviceService } from '../../services/authservice.service';

@Component({
  selector: 'app-create-schedule',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-schedule.component.html',
  styleUrl: './create-schedule.component.css'
})
export class CreateScheduleComponent implements OnInit {
  createScheduleForm!: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  isSubmitting: boolean = false;
  isAdmin: boolean = false;
  operatorId: number = 0;
  operatorBuses: { busId: number, busNumber: string, operatorName: string , busName: string }[] = [];
  allBuses: { busId: number, busNumber: string, operatorName: string, busName: string }[] = [];
  routes: any[] = []; 
  minDate: string;

  @Output() scheduleCreated = new EventEmitter<void>();

  constructor(private apiService: ApiServiceService, private authService: AuthserviceService) { 
    this.minDate = new Date().toISOString().split('T')[0];
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
      busId: new FormControl(null, [
        Validators.required,
      ]),
      routeId: new FormControl(null, [
        Validators.required,
      ]),
      departureDate: new FormControl('', [
        Validators.required,
        Validators.maxLength(10),
      ]),
      departureTime: new FormControl('', [
        Validators.required,
        Validators.maxLength(5),
      ]),
      arrivalDate: new FormControl('', [
        Validators.required,
        Validators.maxLength(10),
      ]),
      arrivalTime: new FormControl('', [
        Validators.required,
        Validators.maxLength(5),
      ]),
      fare: new FormControl(0, [
        Validators.required,
        Validators.min(1)
      ]),
    });
  }

  fetchOperatorBuses(): void {
    this.apiService.fetchBusesByOperatorId().subscribe({
      next: (buses: any) => {
        // Now storing busId and busNumber as an object
        this.operatorBuses = buses.map((bus: any) => ({
          busId: bus.busId,
          busNumber: bus.busNumber,
          operatorName: bus.operatorName,
          busName: bus.busName
        }));
        console.log('Operator Buses:', this.operatorBuses);
      },
      error: (error: any) => {
        this.handleError(error);
      }
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
      error: (error: any) => {
        this.handleError(error);
      }
    });
  }
  
  

  fetchAllRoutes(): void {
    this.apiService.fetchAllRoutes().subscribe({
      next: (routes: any) => {
        this.routes = routes;
        console.log('Available Routes:', this.routes);
      },
      error: (error: any) => {
        this.handleError(error);
      }
    });
  }

  onCreateSchedule(): void {
    const formValues = { ...this.createScheduleForm.value };
    formValues.busId = Number(formValues.busId);
    formValues.routeId = Number(formValues.routeId);
  
    // Combine departureDate and departureTime into a single Date string in ISO format
    const departureDateTime = `${formValues.departureDate}T${formValues.departureTime}:00`;
    const arrivalDateTime = `${formValues.arrivalDate}T${formValues.arrivalTime}:00`;
  
    // Convert to the required format for the API
    const transformedValues = {
      busId: formValues.busId,
      routeId: formValues.routeId,
      departureTime: departureDateTime,  
      arrivalTime: arrivalDateTime,      
      fare: formValues.fare,
      date: formValues.departureDate     
    };
  
    console.log('Transformed Schedule:', transformedValues);
  
    this.isSubmitting = true;
    this.apiService.createSchedule(transformedValues).subscribe({
      next: () => {
        this.successMessage = 'Schedule created successfully!';
        this.scheduleCreated.emit();
        this.createScheduleForm.reset();
      },
      error: (error: any) => {
        this.handleError(error);
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }
  

  handleError(error: any): void {
    this.errorMessage = error?.error?.message || 'An unexpected error occurred. Please try again later.';
    console.error(this.errorMessage, error);
  }
}
