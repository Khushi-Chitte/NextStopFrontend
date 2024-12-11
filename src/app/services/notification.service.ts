import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private notificationSentSource = new Subject<void>();

  // Observable stream
  notificationSent$ = this.notificationSentSource.asObservable();

  // Method to trigger notification event
  notifyNewNotification() {
    this.notificationSentSource.next();
  }
}
