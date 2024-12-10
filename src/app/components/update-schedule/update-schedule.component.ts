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
    const departureDate = this.data.departureTime?.split('T')[0];
    const departureTime = this.data.departureTime?.split('T')[1]?.substring(0, 5);
    const arrivalDate = this.data.arrivalTime?.split('T')[0];
    const arrivalTime = this.data.arrivalTime?.split('T')[1]?.substring(0, 5);

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

    const updatedSchedule = {
      busId: Number(formValues.busId),
      routeId: Number(formValues.routeId),
      departureTime: `${formValues.departureDate}T${formValues.departureTime}:00`,
      arrivalTime: `${formValues.arrivalDate}T${formValues.arrivalTime}:00`,
      fare: formValues.fare,
    };

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
