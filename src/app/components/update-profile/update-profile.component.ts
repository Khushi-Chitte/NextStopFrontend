import { Component, OnInit } from '@angular/core';
import { ApiServiceService } from '../../services/api-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-update-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './update-profile.component.html',
  styleUrl: './update-profile.component.css'
})
export class UpdateProfileComponent implements OnInit{
  userData = {
    userId: 0,
    name: '',
    phone: '',
    address: '',
    role: '',
    isActive: true
  };

  errorMessage: string = '';
  successMessage: string = '';

  constructor(private router: Router, private apiService: ApiServiceService) {}

  ngOnInit(): void {
    this.fetchUserDetails();
  }

  fetchUserDetails(): void {
    this.apiService.fetchUserDetails().subscribe({
      next: (response) => {
        this.userData = {
          userId: response.userId || 0,
          name: response.name || '',
          phone: response.phone || '',
          address: response.address || '',
          role: response.role || '',
          isActive: response.isActive ?? true
        };
      },
      error: (error) => {
        this.errorMessage = 'Failed to fetch user details. Please try again.';
        console.error('Error fetching user details:', error);
      }
    });
  }

  onUpdateUser(): void {
    this.apiService.updateUser(this.userData).subscribe({
      next: (response) => {
        this.successMessage = 'User updated successfully!';
        this.errorMessage = '';
        console.log('Update response:', response);

        this.router.navigate(['/app-profile'], {
          queryParams: { success: 'true', message: 'Profile updated successfully!' }
        });

      },
      error: (error) => {
        this.errorMessage = 'Failed to update user. Please try again.';
        this.successMessage = '';
        console.error('Error updating user:', error);
      }
    });
  }
}