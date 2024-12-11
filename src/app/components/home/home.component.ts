import { Component, OnInit } from '@angular/core';
import { SearchComponent } from '../search/search.component';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SearchComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  constructor(private notificationService : NotificationService) { }

  ngOnInit(): void {
    this.notificationService.notifyNewNotification();
  }

}