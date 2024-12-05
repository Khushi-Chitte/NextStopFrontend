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
    name: '',
    email: '',
    password: '',
    role: null,
  };

  roles = [
    { id: 'admin', name: 'Admin' },
    { id: 'passenger', name: 'Passenger' },
    { id: 'operator', name: 'Operator' },
  ];

  fetchedUser: any = null;

  onSubmit() {
  // Storing the user data in localStorage
  localStorage.setItem('userDetails', JSON.stringify(this.user));
  console.log('User registered:', this.user);
}


  // Method to fetch and display user data from localStorage
  fetchData() {
    const storedUser = JSON.parse(localStorage.getItem('userDetails') || '{}');
    this.fetchedUser = storedUser;
    console.log('Fetched User Data:', this.fetchedUser);
  }

  // Method to get role name by role ID
  getRoleName(roleId: string | null): string {
    const role = this.roles.find((r) => r.id === roleId);
    return role ? role.name : 'Role not found';
  }
}
