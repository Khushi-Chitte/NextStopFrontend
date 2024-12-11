import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiServiceService } from '../../services/api-service.service';
import { AuthserviceService } from '../../services/authservice.service';

@Component({
  selector: 'app-add-bus',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-bus.component.html',
  styleUrl: './add-bus.component.css'
})
export class AddBusComponent implements OnInit {
  createBusForm!: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  isSubmitting: boolean = false;
  isAdmin: boolean = false;

  operators: any[] = [];

  busTypes = ['Sleeper', 'AC', 'NonAC', 'SleeperAC', 'Seater'];

  createdBusId : number = 0;
  createdBusTotalSeats : number = 0;
  


  @Output() busCreated = new EventEmitter<void>();

  constructor(private apiService: ApiServiceService, private authService: AuthserviceService) { }


  ngOnInit(): void {
    this.isAdmin = this.authService.getUserRoles() === 'admin';

    console.log('Admin?: ', this.isAdmin);

    const operatorId = parseInt(localStorage.getItem('userId') ?? '0');

    if(this.isAdmin){
      this.fetchAllOperators();
    }

    this.createBusForm = new FormGroup({
      operatorId: new FormControl(
        this.isAdmin ? null : operatorId, 
        [Validators.required]
      ),
      busName: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      busNumber: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      busType: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      totalSeats: new FormControl(0, [Validators.required, Validators.min(1)]),
      amenities: new FormControl('', [Validators.required, Validators.maxLength(255)])
    });
  }

  onAddBus(): void {
    if(this.createBusForm.invalid) {
      this.errorMessage = 'Please fill all required fields correctly.';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const busData = this.createBusForm.value;

    console.log('Bus data:', busData);

    this.apiService.createBus(busData).subscribe({
      next: (bus: any) => {
        console.log(bus);
        this.createdBusId = bus.busId;
        this.createdBusTotalSeats = bus.totalSeats;

        this.isSubmitting = false;
        this.busCreated.emit();
        this.createBusForm.reset();
      },
      error: (error: any) => {
        this.handleError(error);
        this.isSubmitting = false;
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }

  fetchAllOperators(): void {
    this.apiService.fetchAllUsers().subscribe({
      next: (users: any[]) => {
        this.operators = users.filter(user => user.role === 'operator');
        console.log('Operators:', this.operators);
      },
      error: (error: any) => {
        console.log('Cannot fetch users:', error);
        this.handleError(error);
      },
    });
  }
  

  handleError(error: any) {
    if (error.error) {
      if (typeof error.error === 'string') {
        this.errorMessage = error.error;
      } else if (error.error.message) {
        this.errorMessage = error.error.message;
      } else {
        this.errorMessage = 'Failed to create bus. Please try again';
      }
    } else {
      this.errorMessage = 'An unexpected error occurred. Please try again later.';
    }
    console.error(this.errorMessage, error);
  }  

}
