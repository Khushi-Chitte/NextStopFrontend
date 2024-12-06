import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthserviceService } from '../../services/authservice.service';
import { Router } from '@angular/router';

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

  constructor(private authS: AuthserviceService, private router : Router) { }

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

            alert('Logged in successfully!');

            this.router.navigate(['/app-home']);
            } else {
              console.error('Invalid response from server');
            }
          },
          error: (error: any) => {
            console.error('Login failed:', error);
            if(error.status === 401) {
              this.errorMessage = 'Invalid email or password. Please try again.';
              alert(this.errorMessage); 
            } else {
              this.errorMessage = 'An unexpected error occurred. Please try again later.';
              alert(this.errorMessage);
            }
          },
          complete: () => {
            console.log('Request completed');
          }
      });
    }
  }
}
