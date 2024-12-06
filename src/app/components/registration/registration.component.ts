import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthserviceService } from '../../services/authservice.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
})
export class RegistrationComponent implements OnInit {
  registerForm!: FormGroup;

  constructor(private authS: AuthserviceService, private router : Router) { }

  roles = ['passenger', 'operator', 'admin'];

  fetchedUser: any = null;

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      name: new FormControl('', [
        Validators.required,
        Validators.maxLength(100),
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.email,
        Validators.maxLength(100),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(100),
      ]),
      phone: new FormControl('', [
        Validators.required,
        Validators.maxLength(15),
      ]),
      address: new FormControl('', [
        Validators.required,
        Validators.maxLength(255),
      ]),
      role: new FormControl('', [
        Validators.required,
        Validators.maxLength(50),
      ]),
      isActive: new FormControl(true, Validators.required)
    });
  }

  onRegister(): void {
    if(this.registerForm.valid) {
      const registerData = this.registerForm.value;
      
      this.authS.register(
        registerData.name,
        registerData.email,
        registerData.password,
        registerData.phone,
        registerData.address,
        registerData.role,
        registerData.isActive
      ).subscribe({
        next: (response: any) => {
          if (response && response.jwtToken && response.refreshToken) {
            this.authS.setToken(response.jwtToken);
            this.authS.setRefreshToken(response.refreshToken);

            const userId = response.user.userId; 
            this.authS.setUserId(userId);

            const email = response.user.email;
            this.authS.setEmail(email);

            console.log('Registration successful!');
            alert('Registered and Logged in successfully!');

            this.router.navigate(['/app-home']);
          } else {
            console.error('Invalid response from server');
          }
        },
        error: (error: any) => {
          console.error('Registration failed', error);
        },
        complete: () => {
          console.log('Request completed');
        }
      });
    }
  }
}
