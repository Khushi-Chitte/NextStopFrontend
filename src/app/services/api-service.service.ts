import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Constant } from '../components/Constants/constant';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {
  allBusesData = signal<any[]>([]);
  allBusSeats = signal<any[]>([]);

  constructor(private http:HttpClient) { }

  fetchBusesData(){
    this.http.get<any[]>(Constant.BASE_URI + Constant.GetAllBuses).subscribe(
      (result) => this.allBusesData.set(result)
    );
   }

   fetchBusSeats(busId: number){
    this.http.get<any[]>(Constant.BASE_URI + Constant.GetSeatsByBusId + busId).subscribe(
      (result) => this.allBusSeats.set(result)
    );
   }
}
