import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-create-feedback-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-feedback-dialog.component.html',
  styleUrl: './create-feedback-dialog.component.css'
})
export class CreateFeedbackDialogComponent implements OnInit {
  feedbackForm!: FormGroup;
  rating: number = 0;
  stars: number[] = [1, 2, 3, 4, 5];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CreateFeedbackDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { bookingId: number }
  ) {
    this.feedbackForm = this.fb.group({
      bookingId: [data.bookingId, Validators.required],
      rating: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
      feedbackText: ['', [Validators.required, Validators.maxLength(500)]],
    });
  }

  ngOnInit(): void {}

  submitFeedback(): void {
    if (this.feedbackForm.valid) {
      this.dialogRef.close(this.feedbackForm.value);
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  setRating(value: number): void {
    this.rating = value;
    this.feedbackForm.get('rating')?.setValue(value); // Update form value
  }
  
}
