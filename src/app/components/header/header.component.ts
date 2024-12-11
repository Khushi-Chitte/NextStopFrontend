import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink,RouterLinkActive } from '@angular/router';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthserviceService } from '../../services/authservice.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ApiServiceService } from '../../services/api-service.service';
import { NotificationService } from '../../services/notification.service';


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
  notifications: { notificationId: number, message: string; timestamp: Date; isRead: boolean }[] = [];
  unreadNotificationsCount: number = 0;
  private notificationSubscription!: Subscription;

  constructor(private authS: AuthserviceService, private router: Router, private apiService: ApiServiceService, private notificationService: NotificationService ) {}

  ngOnInit(): void {
    this.authStatusSubscription = this.authS.isAuthenticated$.subscribe(status => {
      this.isAuthenticated = status; 
      this.role = this.authS.getUserRoles();
      console.log('Current role: ', this.role);
    });

    if(this.isAuthenticated){
      this.loadNotifications();
    }

    this.notificationSubscription = this.notificationService.notificationSent$.subscribe(() => {
      this.loadNotifications(); 
    });    
  }

  ngOnDestroy(): void {
    // Unsubscribe to prevent memory leaks
    if (this.authStatusSubscription) {
      this.authStatusSubscription.unsubscribe();
    }

    if (this.notificationSubscription) {
      this.notificationSubscription.unsubscribe(); 
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

  
  loadNotifications(): void {
    this.apiService.viewNotifications().subscribe({
      next: (response: any) => {
        if (Array.isArray(response) && response.length > 0) {
          // Process notifications if available
          this.notifications = response.map((notification: any) => ({
            notificationId: notification.notificationId,
            message: notification.message,
            timestamp: new Date(notification.sentDate),
            isRead: notification.isRead,
          }));
        } else {
          // If there are no notifications, ensure the array is empty
          this.notifications = [];
        }
        this.updateUnreadNotificationsCount(); // Always update count
      },
      error: (error: any) => {
        // Handle error gracefully, without breaking the app
        console.error('Error loading notifications:', error.message || error);
        this.notifications = []; // Ensure notifications is always an array
        this.updateUnreadNotificationsCount();
      },
    }); 
  }
  

  updateUnreadNotificationsCount(): void {
    this.unreadNotificationsCount = this.notifications.filter(notification => !notification.isRead).length;
  }

  markNotificationAsRead(notificationId: number): void {
    this.apiService.markNotifRead(notificationId).subscribe({
      next: () => {
        this.loadNotifications(); 
        this.updateUnreadNotificationsCount(); 
        console.log(`Notification ${notificationId} marked as read.`);
      },
      error: (error) => {
        console.error('Error marking notification as read:', error.message || error);
        alert('Failed to mark notification as read. Please try again later.');
      }
    });
  }
  



}