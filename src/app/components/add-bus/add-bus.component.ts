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

  busTypes = ['Sleeper', 'AC', 'NonAC', 'SleeperAC', 'Seater'];

  createdBusId : number = 0;
  createdBusTotalSeats : number = 0;
  


  @Output() busCreated = new EventEmitter<void>();

  constructor(private apiService: ApiServiceService, private authService: AuthserviceService) { }


  ngOnInit(): void {
    this.isAdmin = this.authService.getUserRoles() === 'admin';

    console.log(this.isAdmin);

    var operatorId = parseInt(localStorage.getItem('userId') ?? '0');

    if(this.isAdmin) operatorId = 0;

    console.log(`creating bus with operatorId: ${operatorId}`);

    this.createBusForm = new FormGroup({
      operatorId: new FormControl(operatorId, [
        Validators.required,
      ]),
      busName: new FormControl('', [
        Validators.required,
        Validators.maxLength(100),
      ]),
      busNumber: new FormControl('', [
        Validators.required,
        Validators.maxLength(50),
      ]),
      busType: new FormControl('', [
        Validators.required,
        Validators.maxLength(50),
      ]),
      totalSeats: new FormControl(0, [
        Validators.required,
        Validators.min(0),
      ]),
      amenities: new FormControl('', [
        Validators.required,
        Validators.maxLength(255),
      ]),
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

    this.apiService.createBus(busData).subscribe({
      next: (bus: any) => {
        console.log(bus);
        this.createdBusId = bus.busId;
        this.createdBusTotalSeats = bus.totalSeats;

        this.isSubmitting = false;
        this.createBusForm.reset();

        const seatNumbers = this.generateSeatNumbers(this.createdBusTotalSeats);

        const seatData = {
          busId: this.createdBusId,
          seatNumbers: seatNumbers
        };

        this.createSeatsForBus(seatData);
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

  createSeatsForBus(seatData: any) {
    this.apiService.createSeatsForBus(seatData).subscribe({
      next: (response: any) => {
        this.successMessage = 'Bus and its seats created successfully!';
        this.isSubmitting = false;
  
        // Reset the form with initial values if needed
        var operatorId = parseInt(localStorage.getItem('userId') ?? '0');

        if(this.isAdmin) operatorId = 0;
        
        this.createBusForm.reset({
          operatorId: operatorId, // Retain operatorId if needed
        });
        
        // Mark as pristine and untouched to refresh state
        this.createBusForm.markAsPristine();
        this.createBusForm.markAsUntouched();
        this.createBusForm.updateValueAndValidity(); // Ensure validity is recalculated
  
        this.busCreated.emit();
      },
      error: (error: any) => {
        this.errorMessage = 'Failed to create seats. So bus also got deleted. Please try again.';
        console.error(this.errorMessage, error);
        this.deleteBus(this.createdBusId);
        this.isSubmitting = false;
      },
    });
  }
  
  
  

  deleteBus(busId: number) {
    this.apiService.deleteBus(busId).subscribe({
      next: (response) => {
        console.log('Bus deleted:', response);
        this.isSubmitting = false;
      },
      error: (error) => {
        console.error('Error deleting Bus:', error);
        this.isSubmitting = false;
      }
    });
  }

  generateSeatNumbers(totalSeats: number): string[] {
    let seatNumbers: string[] = [];
    
    for (let i = 1; i <= totalSeats; i++) {
      seatNumbers.push(i.toString());
    }
    
    return seatNumbers;
  }
  


}
