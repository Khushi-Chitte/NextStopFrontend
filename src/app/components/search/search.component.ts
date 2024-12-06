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
  @Input() searchData = { origin: '', destination: '', travelDate: '' };

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
