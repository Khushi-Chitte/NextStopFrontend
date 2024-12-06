import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { API_URL } from '../Constants';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {
  allBusesData = signal<any[]>([]);
  allBusSeats = signal<any[]>([]);

  constructor(private http:HttpClient) { }

  fetchBusesData(){
    this.http.get<any[]>(API_URL + 'Bus/GetAllBuses').subscribe(
      (result) => this.allBusesData.set(result)
    );
   }

   fetchBusSeats(){
    this.http.get<any[]>(API_URL + 'Seat/GetSeatsByBusId/').subscribe(
      (result) => this.allBusSeats.set(result)
    );
   }
}
