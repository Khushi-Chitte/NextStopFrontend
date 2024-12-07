import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Constant } from '../components/Constants/constant';
import { catchError, Observable, of, throwError } from 'rxjs';

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

   fetchUserDetails(): Observable<any> {
    const userId = localStorage.getItem('userId');
    const jwtToken = localStorage.getItem('jwtToken');

    if(!userId || !jwtToken) {
      return throwError(() => new Error('User not authenticated or missing user ID/token.'));
    }

    const headers = {
      Authorization: `Bearer ${jwtToken}`,
    }

    return this.http.get(`${Constant.BASE_URI}${Constant.GetUserById}${userId}`, { headers }).pipe(
      catchError((error: any) => {
        console.error('Error fetching user details:', error);
        return throwError(() => error);
      })
    );

   }

   updateUser(userData: any): Observable<any> {
    const userId = localStorage.getItem('userId');
    const jwtToken = localStorage.getItem('jwtToken');
  
    if (!userId || !jwtToken) {
      return throwError(() => new Error('User not authenticated or missing user ID/token.'));
    }
  
    const headers = {
      Authorization: `Bearer ${jwtToken}`,
    };
  
    return this.http.put(`${Constant.BASE_URI}${Constant.UpdateUser}${userId}`, userData, { headers }).pipe(
      catchError((error: any) => {
        console.error('Error updating user details:', error);
        return throwError(() => error);
      })
    );
  }
  

}
