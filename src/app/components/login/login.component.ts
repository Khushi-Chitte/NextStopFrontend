import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginData = {
    email: '',
    password: ''
  };

  onLogin() {
  const storedUser = JSON.parse(localStorage.getItem('userDetails') || '{}');
  
  if (this.loginData.email === storedUser.email && this.loginData.password === storedUser.password) {
    console.log('Login successful');
    localStorage.setItem('loggedIn', 'true');
  } else {
    console.log('Invalid credentials');
    alert('Invalid email or password');
  }
}
}
