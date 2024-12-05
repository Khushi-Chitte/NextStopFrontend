import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
<<<<<<< HEAD
import { Router } from '@angular/router';
=======
>>>>>>> 0e6a1e318a02a9f3de91fc822967d8e15a98ba07
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
<<<<<<< HEAD
  imports: [FormsModule],
=======
  imports: [FormsModule, CommonModule],
>>>>>>> 0e6a1e318a02a9f3de91fc822967d8e15a98ba07
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
<<<<<<< HEAD
 searchData = { from: '', to: '', date: '' };

  constructor(private router: Router) {}

  onSearch() {
    // Pass search data to the ViewresultsComponent via queryParams
    this.router.navigate(['/app-viewresults'], {
      queryParams: {
        from: this.searchData.from,
        to: this.searchData.to,
        date: this.searchData.date,
      },
    });
=======
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
>>>>>>> 0e6a1e318a02a9f3de91fc822967d8e15a98ba07
  }
}
