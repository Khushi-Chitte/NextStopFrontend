import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiServiceService } from '../../services/api-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-route',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-route.component.html',
  styleUrl: './create-route.component.css'
})
export class CreateRouteComponent implements OnInit{
  createRouteForm!: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  isSubmitting: boolean = false;

  @Output() routeCreated = new EventEmitter<void>();

  constructor(private apiService: ApiServiceService) { }

  ngOnInit(): void {
    this.createRouteForm = new FormGroup({
      origin: new FormControl('', [
        Validators.required,
        Validators.maxLength(100),
      ]),
      destination: new FormControl('', [
        Validators.required,
        Validators.maxLength(100),
      ]),
      distance: new FormControl(0, [
        Validators.required,
        Validators.min(0),
      ]),
      estimatedTime: new FormControl('', [
        Validators.required,
        Validators.maxLength(50),
      ]),
    });
  }

  onCreateRoute(): void {
    if (this.createRouteForm.invalid) {
      this.errorMessage = 'Please fill all required fields correctly.';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const routeData = this.createRouteForm.value;

    this.apiService.createRoute(routeData).subscribe({
      next: () => {
        this.successMessage = 'Route created successfully!';
        this.createRouteForm.reset();
        this.isSubmitting = false;

        this.routeCreated.emit();
      },
      error: (error: any) => {
        this.errorMessage = 'Failed to create route. Please try again.';
        console.error(this.errorMessage, error);
        this.isSubmitting = false;
      },
    });

  }


}
