import { Component, ViewChild } from '@angular/core';
import { CreateRouteComponent } from '../create-route/create-route.component';
import { ViewRoutesComponent } from '../view-routes/view-routes.component';

@Component({
  selector: 'app-manage-routes',
  standalone: true,
  imports: [CreateRouteComponent, ViewRoutesComponent],
  templateUrl: './manage-routes.component.html',
  styleUrl: './manage-routes.component.css'
})
export class ManageRoutesComponent {
  @ViewChild(ViewRoutesComponent) viewRoutesComponent!: ViewRoutesComponent;
  
  onRouteCreated(): void {
    if (this.viewRoutesComponent) {
      this.viewRoutesComponent.reloadRoutes();
    }

  }

}
