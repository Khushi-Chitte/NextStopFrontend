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
  }
}
