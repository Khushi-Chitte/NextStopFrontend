import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ApiServiceService } from '../../services/api-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthserviceService } from '../../services/authservice.service';
import { MatDialog } from '@angular/material/dialog';
import { UpdateRoutesComponent } from '../update-routes/update-routes.component';

@Component({
  selector: 'app-view-routes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './view-routes.component.html',
  styleUrl: './view-routes.component.css'
})
export class ViewRoutesComponent implements OnInit, OnDestroy {
  routes: any[] = [];
  filteredRoutes: any[] = [];
  errorMessage: string = '';
  isAdmin: boolean = false;


  searchRouteId: string = '';
  searchOrigin: string = '';
  searchDestination: string = '';

  isAuthenticated: boolean = false;
  private authStatusSubscription!: Subscription;



  constructor(private apiService: ApiServiceService, private authService : AuthserviceService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.isAdmin = this.authService.getUserRoles() === 'admin';


    this.loadRoutes();

    this.authStatusSubscription = this.authService.isAuthenticated$.subscribe(status =>  {
      this.isAuthenticated = status;
    });
  }

  ngOnDestroy(): void {
    if (this.authStatusSubscription) {
      this.authStatusSubscription.unsubscribe();
    }
  }

  loadRoutes(): void {
    this.apiService.fetchAllRoutes().subscribe({
      next: (routes: any) => {
        this.routes = routes;
        this.filteredRoutes = routes;
      },
      error: (error: any) => {
        this.errorMessage = 'Failed to fetch routes';
        console.error(this.errorMessage);
      }
    });
  }

  searchByRouteId(): void {
    const routeIdQuery = this.searchRouteId.trim();

    if (routeIdQuery) {
      this.filteredRoutes = this.routes.filter((route) =>
        route.routeId.toString().includes(routeIdQuery)
      );
    } else {
      this.filteredRoutes = [...this.routes];
    }
  }

  searchByOrigin(): void {
    const originQuery = this.searchOrigin.toLowerCase().trim();

    if (originQuery) {
      this.filteredRoutes = this.routes.filter(
        (route) =>
          route.origin.toLowerCase().includes(originQuery)
      );
    } else {
      this.filteredRoutes = [...this.routes];
    }
  }

  searchByDestination(): void {
    const destinationQuery = this.searchDestination.toLowerCase().trim();

    if (destinationQuery) {
      this.filteredRoutes = this.routes.filter(
        (route) => route.destination.toLowerCase().includes(destinationQuery)
      );
    } else {
      this.filteredRoutes = [...this.routes];
    }
  }

  resetSearch(): void {
    this.searchRouteId = '';
    this.searchOrigin = '';
    this.searchDestination = '';
    this.filteredRoutes = [...this.routes];
  }

  onUpdate(routeId: any): void {
    if (!this.isAuthenticated) {
      alert('Login first to update');
    } else {
      // Find the route with the given routeId
      const routeToUpdate = this.routes.find(route => route.routeId === routeId);

      console.log(routeToUpdate);

      if (routeToUpdate) {
        const dialogRef = this.dialog.open(UpdateRoutesComponent, {
          data: { ...routeToUpdate }  
        });

        dialogRef.afterClosed().subscribe(updatedRoute => {
          if (updatedRoute) {
            this.apiService.updateRoute(routeId, updatedRoute).subscribe({
              next: (response) => {
                console.log('Route updated:', response);
                this.loadRoutes();  
              },
              error: (error) => {
                console.error('Error updating route:', error);
              }
            });
          }
        });
      }
    }
  }

  onDelete(routeId: number): void {
    if(!this.isAuthenticated) {
      alert('Login first to delete');
    }
    else {
      if (confirm('Are you sure you want to delete this route?')) {
        this.apiService.deleteRoute(routeId).subscribe({
          next: (response) => {
            console.log('Route deleted:', response);
            this.loadRoutes(); 
          },
          error: (error) => {
            console.error('Error deleting route:', error);
          }
        });
      }
    }
  }

  reloadRoutes(): void {
    this.loadRoutes();
  }

}
