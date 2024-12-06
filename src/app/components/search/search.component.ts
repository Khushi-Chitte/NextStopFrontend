import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
  @Input() searchData = { Origin: '', Destination: '', TravelDate: '' }; // travelDate as a string
  minDate: string;

  constructor(private router: Router) {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }

  onSearch() {
    const travelDate = new Date(this.searchData.TravelDate);

    if (!isNaN(travelDate.getTime())) {
      const travelDateFormatted = travelDate.toISOString().split('T')[0];  // 'yyyy-mm-dd'

      this.router.navigate(['/app-viewresults'], {
        queryParams: {
          Origin: this.searchData.Origin,
          Destination: this.searchData.Destination,
          TravelDate: travelDateFormatted, 
        },
      });
    } else {
      console.error("Invalid travel date");
    }
  }
}
