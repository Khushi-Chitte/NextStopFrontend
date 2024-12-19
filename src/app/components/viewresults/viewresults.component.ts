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
  busTypes: string[] = ['Sleeper', 'AC', 'NonAC', 'SleeperAC', 'Seater'];
  filteredBuses: any[] = [];
  selectedBusTypes: string[] = [];
  searchParams: any = {
    Origin: '',
    Destination: '',
    TravelDate: ''
  }; 

  isAuthenticated: boolean = false;
  showFilters: boolean = false;
  showSortOptions: boolean = false;
  private authStatusSubscription!: Subscription;
  private queryParamsSubscription!: Subscription;
  loading: boolean = true;
  isPassenger: boolean = false;
  totalSeats: number = 0;
  seatsBooked: number = 0;

  constructor(private route: ActivatedRoute, private router: Router, private apiS: ApiServiceService, private authS: AuthserviceService ) {}

  ngOnInit() {
    this.isPassenger = this.authS.getUserRoles() === 'passenger';
    
    this.queryParamsSubscription = this.route.queryParams.subscribe((params) => {
      console.log(params['TravelDate']);


      this.searchParams = {
        Origin: params['Origin'],
        Destination: params['Destination'],
        TravelDate: params['TravelDate']
      };

      this.fetchAllSchedules();
    });

    this.authStatusSubscription = this.authS.isAuthenticated$.subscribe(status => {
      this.isAuthenticated = status;
    });
  }

  ngOnDestroy(): void {
    if (this.queryParamsSubscription) {
      this.queryParamsSubscription.unsubscribe();
    }
    if (this.authStatusSubscription) {
      this.authStatusSubscription.unsubscribe();
    }
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  toggleSortOptions() {
    this.showSortOptions = !this.showSortOptions;
  }

  fetchAllSchedules() {
    this.loading = true;
  
    const travelDate = new Date(this.searchParams.TravelDate);
    const istOffset = 5.5 * 60 * 60 * 1000; 

    travelDate.setHours(0, 0, 0, 0);
    const istTravelDate = new Date(travelDate.getTime() + istOffset);
    this.apiS.fetchAllSchedules().subscribe({
      next: (schedules: any[]) => {
        const filteredSchedules = schedules.filter(schedule => {
          const scheduleDepartureDate = new Date(schedule.departureTime);
  
          const istScheduleDeparture = new Date(scheduleDepartureDate.getTime() + istOffset);

          return schedule.origin.toLowerCase() === this.searchParams.Origin.toLowerCase() &&
          schedule.destination.toLowerCase() === this.searchParams.Destination.toLowerCase() &&
          this.isSameDate(istScheduleDeparture, istTravelDate);
        });

  
        this.buses = filteredSchedules;
        this.buses.forEach(bus => this.fetchBusDetailsById(bus.busId));
        this.filteredBuses = [...this.buses]; 
      },
      error: (error: any) => {
        console.error('Error fetching schedules:', error);
        this.filteredBuses = [];
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
    

  isSameDate(date1: Date, date2: Date): boolean {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  }
   
  

  onBusTypeChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.checked) {
      this.selectedBusTypes.push(target.value);
    } else {
      this.selectedBusTypes = this.selectedBusTypes.filter(type => type !== target.value);
    }
    this.filterBuses();
  }

  onSortChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const sortOption = target.value;
    
    if (sortOption === 'priceAsc') {
      this.filteredBuses.sort((a, b) => a.fare - b.fare);
    } else if (sortOption === 'priceDesc') {
      this.filteredBuses.sort((a, b) => b.fare - a.fare);
    } else if (sortOption === 'rating') {
      this.filteredBuses.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
    }
  }

  resetFilters() {
    this.showFilters = false;
    this.showSortOptions = false;
    this.selectedBusTypes = [];
    this.filteredBuses = [...this.buses];
  }

  filterBuses() {
    if (this.selectedBusTypes.length === 0) {
      this.filteredBuses = [...this.buses];
    } else {
      this.filteredBuses = this.buses.filter(bus => this.selectedBusTypes.includes(bus.busType));
    }
  }

  fetchBusDetailsById(busId: any) {
    this.apiS.fetchBusDetailsById(busId).subscribe({
      next: (busDetails: any) => {
        console.log('Bus Details:', busDetails);

        const totalSeats = busDetails.totalSeats;

        const bus = this.buses.find(b => b.busId === busId);
        if (bus) {
          bus.busType = busDetails.busType; 
          const bookedSeats = bus.seats.length;
          const seatsAvailable = totalSeats - bookedSeats;
          bus.availableSeats = seatsAvailable;
        }

        this.fetchBusRatings(busId);
      },
      error: (error: any) => {
        console.error('Error fetching bus details: ', error);
      }
    });
  }

  fetchBusRatings(busId: any) {
    this.apiS.getFeedbacksByBusId(busId).subscribe({
      next: (feedbacks: any[]) => {
        const bus = this.buses.find(b => b.busId === busId);
        if (bus && feedbacks && feedbacks.length > 0) {
          const averageRating = this.calculateAverageRating(feedbacks);
          bus.averageRating = averageRating;
        } else {
          bus.averageRating = 'No ratings yet'; 
        }
      },
      error: (error: any) => {
        console.error('Error fetching feedbacks: ', error);
      }
    });
  }

  calculateAverageRating(feedbacks: any[]): number {
    const totalRating = feedbacks.reduce((acc, feedback) => acc + feedback.rating, 0);
    const averageRating = totalRating / feedbacks.length;
    return parseFloat(averageRating.toFixed(2));
  }

  convertToIST(utcDate: string): string {
    const date = new Date(utcDate);
    const istOffset = 5.5 * 60; // IST offset is UTC +5:30
    date.setMinutes(date.getMinutes() + istOffset);  // Adjust the date to IST
    return date.toISOString();  // or use date.toLocaleString() depending on your needs
  }

  onView(bus: any) {
    if(this.isAuthenticated) {
      console.log('Booking Bus:', bus); // Debug log
      // Navigate to the booking page with bus details
      this.router.navigate(['/app-book-bus'], { 
        queryParams: { 
          scheduleId: bus.scheduleId,
          busId: bus.busId,
          seatsAvailable: bus.availableSeats,
          rating: bus.averageRating ? (bus.averageRating + ' ⭐') : 'No ratings yet' 
        }
     });
    }

    else {
      alert("Please login first to book.");
    }
    
  }
}
