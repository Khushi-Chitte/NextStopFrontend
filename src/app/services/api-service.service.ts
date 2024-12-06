import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Constant } from '../components/Constants/constant';
import { catchError, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {
  allBusesData = signal<any[]>([]);
  allBusSeats = signal<any[]>([]);

  constructor(private http:HttpClient) { }

  fetchBusesData() {
    this.http.get<any[]>(Constant.BASE_URI + Constant.GetAllBuses).subscribe(
      (result) => this.allBusesData.set(result)
    );
   }

   fetchBusSeats(busId: number) {
    this.http.get<any[]>(Constant.BASE_URI + Constant.GetSeatsByBusId + busId).subscribe(
      (result) => this.allBusSeats.set(result)
    );
   }

   fetchBusSearchResults(Origin: string, Destination: string, TravelDate: string) : Observable<any> {
    const searchData = {
      Origin: Origin,
      Destination: Destination,
      TravelDate: new Date(TravelDate).toISOString()
    };

    console.log(searchData);
    return this.http.post(Constant.BASE_URI + Constant.SearchBuses, searchData).pipe(
      catchError((error: any) => {
        console.log(error);
        return of(error);
      })
    );

   }
}
