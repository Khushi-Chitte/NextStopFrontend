import { Component, OnInit } from '@angular/core';
import { ApiServiceService } from '../../services/api-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-view-routes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './view-routes.component.html',
  styleUrl: './view-routes.component.css'
})
export class ViewRoutesComponent implements OnInit{
  routes: any[] = [];
  filteredRoutes: any[] = [];
  errorMessage: string = '';


  searchRouteId: string = '';
  searchOrigin: string = '';
  searchDestination: string = '';


  constructor(private apiService: ApiServiceService) { }

  ngOnInit(): void {
    this.loadRoutes();
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
    console.log('Update logic');
  }

  onDelete(routeId: any): void {
    console.log('Delete logic');
  }

  reloadRoutes(): void {
    this.loadRoutes();
  }

}
