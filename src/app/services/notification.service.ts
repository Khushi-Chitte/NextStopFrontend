import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Constant } from '../components/Constants/constant';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(private http: HttpClient) {}

  // Send a notification
  sendNotification(notificationData: any): Observable<any> {
    return this.http.post(`${Constant.BASE_URI}/Notification/SendNotification`, notificationData);
  }

  // Fetch notifications for a user
  getNotifications(userId: number): Observable<any> {
    return this.http.get(`${Constant.BASE_URI}/Notification/ViewNotifications/${userId}`);
  }
}
