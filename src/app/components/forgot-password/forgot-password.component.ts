import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ApiServiceService } from '../../services/api-service.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent implements OnInit {
  resetForm!: FormGroup;
  isSubmitting = false;

  constructor(private dialogRef: MatDialogRef<ForgotPasswordComponent>, private apiService: ApiServiceService) { }

  ngOnInit(): void {
    this.resetForm = new FormGroup({
          email: new FormControl('', [
            Validators.required,
            Validators.email,
            Validators.maxLength(100),
          ]),
          newPassword: new FormControl('', [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(100),
          ])
        });
  }

  onSubmit() {
    this.isSubmitting = true;
    const resetPasswordData = this.resetForm.value;
  
    this.apiService.resetPassword(resetPasswordData).subscribe({
      next: (response: any) => {
        console.log(response);
        this.dialogRef.close({ success: true, message: 'Password reset successful' }); 
      },
      error: (error: any) => {
        console.log(error);
        this.dialogRef.close({ success: false, message: error.error || 'Failed to reset password' });  
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }
  
  onClose() {
    this.dialogRef.close({ success: false, message: 'Password reset aborted' });  
  }
  
}
