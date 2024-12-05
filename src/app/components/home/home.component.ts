import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
 searchData = { origin: '', destination: '', travelDate: '' };

  constructor(private router: Router) {}

  onSearch() {
    // Pass search data to the ViewresultsComponent via queryParams
    this.router.navigate(['/app-viewresults'], {
      queryParams: {
        origin: this.searchData.origin,
        destination: this.searchData.destination,
        travelDate: this.searchData.travelDate,
      },
    });
  }
}
