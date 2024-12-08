import { Component, OnInit } from '@angular/core';
import { ApiServiceService } from '../../services/api-service.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{
  userDetails: any;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private router: Router, private route: ActivatedRoute, private apiS : ApiServiceService) { }

  ngOnInit(): void {
    this.apiS.fetchUserDetails().subscribe({
      next: (user: any) => {
        this.userDetails = user;
        console.log('User Details: ', user);
      },
      error: (error: any) => {
        console.error('Failed to fetch user details:', error);
        this.errorMessage = 'Unable to fetch user details. Please try again later.';
      },
    });

    this.route.queryParams.subscribe((params) => {
      if (params['success'] === 'true' && params['message']) {
        this.successMessage = params['message'];
      }
    });
  }

  onUpdateProfile(): void {
    this.router.navigate(['/app-update-profile']); 
  }
  

}