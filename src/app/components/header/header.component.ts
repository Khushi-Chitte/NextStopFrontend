import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink,RouterLinkActive } from '@angular/router';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthserviceService } from '../../services/authservice.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink,RouterLinkActive,FormsModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})

export class HeaderComponent implements OnInit, OnDestroy{
  isAuthenticated: boolean = false;
  private authStatusSubscription!: Subscription;
  role: string | null = null;

  constructor(private authS: AuthserviceService, private router: Router) {}

  ngOnInit(): void {
    this.authStatusSubscription = this.authS.isAuthenticated$.subscribe(status => {
      this.isAuthenticated = status; 
      this.role = this.authS.getUserRoles();
      console.log('Current role: ', this.role);
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe to prevent memory leaks
    if (this.authStatusSubscription) {
      this.authStatusSubscription.unsubscribe();
    }
  }

onLogout(): void {
  const refreshToken = this.authS.getRefreshToken();
  this.authS.logout(refreshToken).subscribe({
    next: response => {
      console.log('Logout successful:', response.message);
      this.cleanupSession();
      this.router.navigate(['/app-login']);
    },
    error: err => {
      console.error('Logout failed:', err.message || err);
      alert('Failed to logout. Please try again.');
    }
  });
}


private cleanupSession(): void {
  this.authS.removeToken();
  this.authS.removeRefreshToken();
  this.authS.removeEmail();
  this.authS.removeUserId();
}


}