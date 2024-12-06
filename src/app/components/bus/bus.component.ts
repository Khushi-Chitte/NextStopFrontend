import { Component, OnInit, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiServiceService } from '../../services/api-service.service';

@Component({
  selector: 'app-bus',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bus.component.html',
  styleUrl: './bus.component.css'
})
export class BusComponent implements OnInit{
  constructor(private apiservice: ApiServiceService) {
    this.data = this.apiservice.allBusesData;
  }

  data: Signal<any[]>;
  ngOnInit(): void {
    this.apiservice.fetchBusesData();
  }

  loadData() {
    this.apiservice.fetchBusesData();
  }

}
