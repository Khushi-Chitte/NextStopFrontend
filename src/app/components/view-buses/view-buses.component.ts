import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApiServiceService } from '../../services/api-service.service';
import { AuthserviceService } from '../../services/authservice.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UpdateBusesComponent } from '../update-buses/update-buses.component';
import { ViewFeedbacksOperatorsComponent } from '../view-feedbacks-operators/view-feedbacks-operators.component';

@Component({
  selector: 'app-view-buses',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './view-buses.component.html',
  styleUrl: './view-buses.component.css'
})
export class ViewBusesComponent implements OnInit, OnDestroy {
  buses: any[] = [];
  filteredBuses: any[] = [];
  errorMessage: string = '';
  isAdmin: boolean = false;
  @Input() showActions: boolean = true;


  searchBusNumber: string = '';
  searchOperatorId: string = '';

  isAuthenticated: boolean = false;
  private authStatusSubscription!: Subscription;


  constructor(private apiService: ApiServiceService, private authService : AuthserviceService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.isAdmin = this.authService.getUserRoles() === 'admin';
    this.loadBuses();

    this.authStatusSubscription = this.authService.isAuthenticated$.subscribe(status =>  {
      this.isAuthenticated = status;
    });
  }

  ngOnDestroy(): void {
    if (this.authStatusSubscription) {
      this.authStatusSubscription.unsubscribe();
    }
  }

  loadBuses(): void {
    if(this.isAdmin) {
      this.loadBusAdmin();
    } else {
      this.loadBusOperator();
    }
  }

  loadBusOperator() {
    this.apiService.fetchBusesByOperatorId().subscribe({
      next : (buses: any) => {
        this.buses = buses;
        this.filteredBuses = buses;
      },
      error: (error: any) => {
        this.handleError(error);
        console.error(this.errorMessage);
      },
    });
  }

  loadBusAdmin(): void {
    this.apiService.fetchAllBuses().subscribe({
      next: (buses: any) => {
        this.buses = buses;
        this.filteredBuses = buses;
      },
      error: (error: any) => {
        this.handleError(error);
        console.error(this.errorMessage);
      },
    });
  }

  searchByBusNumber(): void {
    const busNumber = this.searchBusNumber.trim();

    if(busNumber) {
      this.filteredBuses = this.buses.filter((bus) => 
        bus.busNumber.includes(busNumber)
      );
    } else {
      this.filteredBuses = [...this.buses];
    }
  }

  searchByOperationId(): void {
    const operatorId = this.searchOperatorId.trim();

    if(operatorId) {
      this.filteredBuses = this.buses.filter((bus) => 
        bus.operatorId.toString().includes(operatorId)
      );
    } else {
      this.filteredBuses = [...this.buses];
    }
  }

  resetSearch(): void {
    this.searchBusNumber = '';
    this.searchOperatorId = '';
    this.filteredBuses = [...this.buses];
  }

  viewFeedBacks(busId: any): void {
    const dialogRef = this.dialog.open(ViewFeedbacksOperatorsComponent, {
      data: {
        busId: busId
      }
    });
  }

  onUpdate(busId: any): void {
    if (!this.isAuthenticated) {
      alert('Login first to update');
    } else {
      const busToUpdate = this.buses.find(bus => bus.busId === busId);

      console.log(busToUpdate);

      if(busToUpdate) {
        const dialogRef = this.dialog.open(UpdateBusesComponent, {
          data: {...busToUpdate}
        });

        dialogRef.afterClosed().subscribe(updatedBus => {
          if(updatedBus) {
            this.apiService.updateBus(busId, updatedBus).subscribe({
              next: (response: any) => {
                console.log('Bus updated:', response);
                this.loadBuses();
              },
              error: (error) => {
                console.error('Error updating bus:', error);
                this.handleError(error);
              }
            });
          }
        });
      }
      
    }

  }

  onDelete(busId: number): void {
    if(!this.isAuthenticated) {
      alert('Login first to delete');
    } else {
      console.log('Delete Bus', busId);
      if(confirm('Are you sure you want to delete this bus?')) {
        this.deleteBus(busId);
      }
    }
  }

  deleteBus(busId: number) {
    this.apiService.deleteBus(busId).subscribe({
      next: (response: any) => {
        console.log(`bus delete with busID ${busId}`);
        this.loadBuses();
      },
      error: (error : any) => {
        console.log(`error deleting bus with busID ${busId}`)
        this.errorMessage = 'error deleting bus';
      }
    });
  }

  handleError(error: any) {
    if (error.error) {
      if (typeof error.error === 'string') {
        this.errorMessage = error.error;
      } else if (error.error.message) {
        this.errorMessage = error.error.message;
      } else {
        this.errorMessage = 'Failed to process the bus. Please try again';
      }
    } else {
      this.errorMessage = 'An unexpected error occurred. Please try again later.';
    }
    console.error(this.errorMessage, error);
  }


  reloadBuses(): void {
    this.loadBuses();
  }

}
