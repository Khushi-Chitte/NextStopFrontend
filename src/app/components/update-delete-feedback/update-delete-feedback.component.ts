import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiServiceService } from '../../services/api-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-update-delete-feedback',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './update-delete-feedback.component.html',
  styleUrl: './update-delete-feedback.component.css'
})
export class UpdateDeleteFeedbackComponent {
  feedbackForm!: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<UpdateDeleteFeedbackComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { feedbackText: string; rating: number },
    private fb: FormBuilder,
    private apiService: ApiServiceService,
    private snackBar: MatSnackBar
  ) {
    this.feedbackForm = this.fb.group({
      rating: [data.rating, [Validators.required, Validators.min(1), Validators.max(5)]],
      feedbackText: [data.feedbackText, [Validators.required, Validators.maxLength(500)]]
    });
  }

  updateFeedback() {
    if (this.feedbackForm.valid) {
      const updatedFeedback = this.feedbackForm.value;
      this.dialogRef.close({ action: 'update', feedback: updatedFeedback }); 
    }
  }

  deleteFeedback() {
    this.dialogRef.close({ action: 'delete' });
  }

  cancel() {
    this.dialogRef.close();
  }


}
