import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthserviceService } from '../../services/authservice.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent implements OnInit{
  loginForm!: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private authS: AuthserviceService, private router : Router, 
    private snackBar: MatSnackBar, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.email,
        Validators.maxLength(100),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(100),
      ])
    });
  }

  onLogin(): void {
    const email = this.loginForm?.get('email')?.value;
    const password = this.loginForm?.get('password')?.value;

    if(email && password) {
      this.authS.login(email, password).subscribe({
        next: (response: any) => {
          if(response && response.jwtToken) { 
            const jwtToken = response.jwtToken;
            const refreshToken = response.refreshToken;
            const userId = response.userId;

            this.authS.setToken(jwtToken);
            this.authS.setRefreshToken(refreshToken);
            this.authS.setUserId(userId);
            this.authS.setEmail(email);

            this.authS.decodeToken();
            console.log(this.authS.getTokenExpiry());

            this.snackBar.open('Logged in successfully!', 'Close', {
              duration: 3000, // 3 seconds
              horizontalPosition: 'right',
              verticalPosition: 'bottom',
            });

            this.router.navigate(['/app-home']);
            } else {
              console.error('Invalid response from server');
            }
          },
          error: (error: any) => {
            console.error('Login failed:', error);
            if (error.status === 401) {
              this.errorMessage = error.error?.message || 'Unauthorized access.';
              this.snackBar.open(this.errorMessage, 'Close', {
                duration: 5000,
                horizontalPosition: 'right',
                verticalPosition: 'bottom',
              });
              console.error('Unauthorized access.', error);
            } else {
              this.snackBar.open('An unexpected error occurred. Please try again later.', 'Close', {
                duration: 5000,
                horizontalPosition: 'right',
                verticalPosition: 'bottom',
              });
              console.error('An unexpected error occurred. Please try again later.', error);
            }
          },
          complete: () => {
            console.log('Request completed');
          }
      });
    }
  }

  onForgetPassword(): void {
    const dialogRef = this.dialog.open(ForgotPasswordComponent);
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.success) {
          this.successMessage = result.message;  
          this.errorMessage='';
          console.log(this.successMessage);
          this.snackBar.open(this.successMessage, 'Close', {
            duration: 5000,
            horizontalPosition: 'right',
            verticalPosition: 'bottom',
          });
        } else {
          this.errorMessage = result.message; 
          this.successMessage='';
          this.snackBar.open(this.errorMessage, 'Close', {
            duration: 5000,
            horizontalPosition: 'right',
            verticalPosition: 'bottom',
          });
        }
      }
    });
  }   
  

}