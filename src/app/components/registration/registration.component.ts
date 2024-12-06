import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
})
export class RegistrationComponent {
  user = {
    userID: 0,
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    role: '',
    isActive: true
  };

  roles = ['passenger', 'operator', 'admin'];

  fetchedUser: any = null;

  onSubmit() {
  this.user.userID = 1;
  localStorage.setItem('userDetails', JSON.stringify(this.user));
  console.log('User registered:', this.user);
}

  fetchData() {
    const storedUser = JSON.parse(localStorage.getItem('userDetails') || '{}');
    this.fetchedUser = storedUser;
    console.log('Fetched User Data:', this.fetchedUser);
  }
}
