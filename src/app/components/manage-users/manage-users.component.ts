import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ManagePassengersComponent } from '../manage-passengers/manage-passengers.component';
import { ManageOperatorsComponent } from '../manage-operators/manage-operators.component';
import { ManageAdminsComponent } from '../manage-admins/manage-admins.component';


@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [CommonModule, FormsModule, ManagePassengersComponent, ManageOperatorsComponent, ManageAdminsComponent],
  templateUrl: './manage-users.component.html',
  styleUrl: './manage-users.component.css',
})
export class ManageUsersComponent {
  activeTab: string = 'passengers'; // Default tab

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }  
}
