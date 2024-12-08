// viewresults.component.ts
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SearchComponent } from '../search/search.component';
import { ApiServiceService } from '../../services/api-service.service';
import { AuthserviceService } from '../../services/authservice.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-viewresults',
  standalone: true,
  imports: [CommonModule, SearchComponent],
  templateUrl: './viewresults.component.html',
  styleUrls: ['./viewresults.component.css'],
})
export class ViewresultsComponent implements OnInit, OnDestroy {
  buses: any[] = []; 
  searchParams: any = {
    Origin: '',
    Destination: '',
    TravelDate: ''
  }; 

  isAuthenticated: boolean = false;
  private authStatusSubscription!: Subscription;
  private queryParamsSubscription!: Subscription;
  loading: boolean = true;

  constructor(private route: ActivatedRoute, private router: Router, private apiS: ApiServiceService, private authS: AuthserviceService ) {}

  ngOnInit() {
    this.queryParamsSubscription = this.route.queryParams.subscribe((params) => {
      console.log('Search Parameters:', params); 
      this.searchParams = { ...params };

      this.fetchBusSearchResults(params['Origin'], params['Destination'], params['TravelDate']);
    });

    this.authStatusSubscription = this.authS.isAuthenticated$.subscribe(status =>  {
      this.isAuthenticated = status;
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe to avoid memory leaks
    if (this.queryParamsSubscription) {
      this.queryParamsSubscription.unsubscribe();
    }

    if (this.authStatusSubscription) {
      this.authStatusSubscription.unsubscribe();
    }
  }


  fetchBusSearchResults(Origin: string, Destination: string, TravelDate: string) {
    this.loading = true;

    this.apiS.fetchBusSearchResults(Origin, Destination, TravelDate).subscribe({
      next: (response: any) => {
        console.log('Response:', response);
        if(response && response.length > 0) {
          this.buses = response;

          this.buses.forEach((bus: any) =>{
            this.fetchBusDetailsById(bus.busId);
          });

          console.log(response);
        } else {
          console.error('Invalid response from server');
        }
      },
      error: (error: any) => {
        console.error('Error in fetching search results', error);
      },
      complete: () => {
        console.log('Request completed');
        this.loading = false;
      }
    });

    
  }

  fetchBusDetailsById(busId: any) {
    this.apiS.fetchBusDetailsById(busId).subscribe({
      next: (busDetails: any) => {
        console.log('Bus Details:', busDetails);
        const bus = this.buses.find(b => b.busId === busId);
        if (bus) {
          bus.busType = busDetails.busType; 
        }
      },
      error: (error: any) => {
        console.error('Error fetching bus details: ', error);
      }
    });
  }
  

  onView(bus: any) {
    if(this.isAuthenticated) {
      console.log('Booking Bus:', bus); // Debug log
      // Navigate to the booking page with bus details
      this.router.navigate(['/app-book-bus'], { 
        queryParams: { 
          scheduleId: bus.scheduleId,
          busId: bus.busId,
          seatsAvailable: bus.availableSeats
        }
     });
    }

    else {
      alert("Please login first to book.");
    }
    
  }
}