import { Component, OnInit, Signal } from '@angular/core';
import { GetAllBusesAPIService } from '../../services/bus/get-all-buses-api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bus',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bus.component.html',
  styleUrl: './bus.component.css'
})
export class BusComponent implements OnInit{
  constructor(private apiservice: GetAllBusesAPIService) {
    this.data = this.apiservice.incomingData;
  }

  data: Signal<any[]>;
  ngOnInit(): void {
    this.apiservice.fetchData();
  }

  loadData() {
    this.apiservice.fetchData();
  }

}
