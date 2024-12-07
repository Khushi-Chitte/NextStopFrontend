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

  constructor(private authS: AuthserviceService, private router: Router) {}

  ngOnInit(): void {
    this.authStatusSubscription = this.authS.isAuthenticated$.subscribe(status => {
      this.isAuthenticated = status; 
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
    this.authS.logout(refreshToken).subscribe(response => {
      if (response.success) {
        console.log(response.message);

        this.authS.removeToken();
        this.authS.removeRefreshToken();
        this.authS.removeEmail();
        this.authS.removeUserId();

        alert('Logged out successfully');
        this.router.navigate(['/app-login']);
      } else {
        console.error(response.message);
      }
    });
  }

}
