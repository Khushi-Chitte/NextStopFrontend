import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  searchBusDto = {
    origin: '',
    destination: '',
    travelDate: ''
  };

  searchResults: any[] = [];

  searchBus(form: any) {
    // Mocking search results
    this.searchResults = [
      {
        busName: 'Express Bus',
        departureTime: new Date('2024-12-04T10:00:00'),
        arrivalTime: new Date('2024-12-04T14:00:00'),
        fare: 300
      },
      {
        busName: 'City Link',
        departureTime: new Date('2024-12-04T11:00:00'),
        arrivalTime: new Date('2024-12-04T15:30:00'),
        fare: 350
      }
    ];
  }

  viewBusDetails(bus: any) {
    console.log('Viewing details for:', bus);
  }
}
