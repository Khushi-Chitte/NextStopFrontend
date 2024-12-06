import { Component } from '@angular/core';
import { SearchComponent } from '../search/search.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SearchComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
//  searchData = { origin: '', destination: '', travelDate: '' };

//   constructor(private router: Router) {}

//   onSearch() {
//     // Pass search data to the ViewresultsComponent via queryParams
//     this.router.navigate(['/app-viewresults'], {
//       queryParams: {
//         origin: this.searchData.origin,
//         destination: this.searchData.destination,
//         travelDate: this.searchData.travelDate,
//       },
//     });
//   }
}
