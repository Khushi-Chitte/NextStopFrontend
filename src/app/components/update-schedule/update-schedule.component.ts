import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiServiceService } from '../../services/api-service.service';
import { AuthserviceService } from '../../services/authservice.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-update-schedule',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-schedule.component.html',
  styleUrl: './update-schedule.component.css'
})
export class UpdateScheduleComponent implements OnInit {
  updateScheduleForm!: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  isSubmitting: boolean = false;
  isAdmin: boolean = false;
  operatorId: number = 0;
  operatorBuses: any[] = [];
  allBuses: any[] = [];
  routes: any[] = [];
  minDate: string;

  constructor(
    private apiService: ApiServiceService,
    private authService: AuthserviceService,
    private dialogRef: MatDialogRef<UpdateScheduleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any // Inject schedule data
  ) {
    this.minDate = new Date().toISOString().split('T')[0];
    console.log(this.minDate);
  }

  ngOnInit(): void {
    this.isAdmin = this.authService.getUserRoles() === 'admin';
    this.operatorId = parseInt(localStorage.getItem('userId') ?? '0');

    this.fetchAllRoutes();
    if (this.isAdmin) {
      this.fetchAllBuses();
    } else {
      this.fetchOperatorBuses();
    }

    this.initializeForm();
  }

  initializeForm(): void {
    const IST_OFFSET = 5 * 60 + 30;

    const departureDateIST = new Date(this.data.departureTime);
    departureDateIST.setMinutes(departureDateIST.getMinutes() + IST_OFFSET);

    const arrivalDateIST = new Date(this.data.arrivalTime);
    arrivalDateIST.setMinutes(arrivalDateIST.getMinutes() + IST_OFFSET);
    
    const departureDate = this.formatDate(departureDateIST);  
    const departureTime = this.formatTime(departureDateIST);  
  
    const arrivalDate = this.formatDate(arrivalDateIST);  
    const arrivalTime = this.formatTime(arrivalDateIST);

    this.updateScheduleForm = new FormGroup({
      busId: new FormControl(this.data.busId, [Validators.required]),
      routeId: new FormControl(this.data.routeId, [Validators.required]),
      departureDate: new FormControl(departureDate, [Validators.required]),
      departureTime: new FormControl(departureTime, [Validators.required]),
      arrivalDate: new FormControl(arrivalDate, [Validators.required]),
      arrivalTime: new FormControl(arrivalTime, [Validators.required]),
      fare: new FormControl(this.data.fare, [Validators.required, Validators.min(1)]),
    });
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private formatTime(date: Date): string {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  fetchOperatorBuses(): void {
    this.apiService.fetchBusesByOperatorId().subscribe({
      next: (buses) => (this.operatorBuses = buses),
      error: (error) => this.handleError(error),
    });
  }

  fetchAllBuses(): void {
    this.apiService.fetchAllBuses().subscribe({
      next: (buses) => (this.allBuses = buses),
      error: (error) => this.handleError(error),
    });
  }

  fetchAllRoutes(): void {
    this.apiService.fetchAllRoutes().subscribe({
      next: (routes) => (this.routes = routes),
      error: (error) => this.handleError(error),
    });
  }

  onUpdateSchedule(): void {
    const formValues = this.updateScheduleForm.value;

    const departureTimeISO = new Date(`${formValues.departureDate}T${formValues.departureTime}:00`).toISOString();
    const arrivalTimeISO = new Date(`${formValues.arrivalDate}T${formValues.arrivalTime}:00`).toISOString();


    const updatedSchedule = {
      busId: Number(formValues.busId),
      routeId: Number(formValues.routeId),
      departureTime: departureTimeISO,
      arrivalTime: arrivalTimeISO,
      fare: formValues.fare,
    };

    console.log(updatedSchedule);

    this.isSubmitting = true;
    this.dialogRef.close(updatedSchedule); // Pass updated schedule back to parent component
  }

  handleError(error: any): void {
    this.errorMessage = error?.error?.message || 'An unexpected error occurred.';
    console.error(this.errorMessage, error);
  }

  onCancel(): void {
    this.dialogRef.close(); 
  }
}
