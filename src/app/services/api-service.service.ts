import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Constant } from '../components/Constants/constant';
import { catchError, Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {
  allBusesData = signal<any[]>([]);

  constructor(private http:HttpClient) { }

  fetchBusesData() {
    this.http.get<any[]>(Constant.BASE_URI + Constant.GetAllBuses).subscribe(
      (result) => this.allBusesData.set(result)
    );
   }

   fetchBusSeats(busId: number): Observable<any[]> {
    return this.http.get<any[]>(`${Constant.BASE_URI}${Constant.GetSeatsByBusId}${busId}`).pipe(
      catchError((error) => {
        console.error('Error fetching bus seats:', error);
        return throwError(() => new Error('Error fetching bus seats.'));
      })
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

  fetchScheduleDetails(scheduleId: number) : Observable<any> {
    return this.http.get(`${Constant.BASE_URI}${Constant.GetScheduleById}${scheduleId}`).pipe(
      catchError((error: any) => {
        console.error('Error fetching user details:', error);
        return throwError(() => error);
      })
    );
  }

  fetchBusDetailsById(busId: any) : Observable<any> {
    return this.http.get(`${Constant.BASE_URI}${Constant.GetBusById}${busId}`).pipe(
      catchError((error: any) => {
        console.error('Error fetching user details:', error);
        return throwError(() => error);
      })
    );
  }

  bookTicket(bookTicketData: any): Observable<any> {
    const userId = localStorage.getItem('userId');
    const jwtToken = localStorage.getItem('jwtToken');
  
    if (!userId || !jwtToken) {
      return throwError(() => new Error('User not authenticated or missing user ID/token.'));
    }
  
    const headers = {
      Authorization: `Bearer ${jwtToken}`,
    };

    return this.http.post(`${Constant.BASE_URI}${Constant.BookTicket}`, bookTicketData, { headers }).pipe(
      catchError((error: any) => {
        console.error('Error fetching user details:', error);
        return throwError(() => error);
      })
    );
  }

  updatePayment(updatePaymentData: any): Observable<any> {
    const userId = localStorage.getItem('userId');
    const jwtToken = localStorage.getItem('jwtToken');
  
    if (!userId || !jwtToken) {
      return throwError(() => new Error('User not authenticated or missing user ID/token.'));
    }
  
    const headers = {
      Authorization: `Bearer ${jwtToken}`,
    };

    return this.http.post(`${Constant.BASE_URI}${Constant.UpdatePayment}`, updatePaymentData, { headers }).pipe(
      catchError((error: any) => {
        console.error('Error fetching user details:', error);
        return throwError(() => error);
      })
    );
  }

  cancelBooking(bookingId: number): Observable<any> {
    const userId = localStorage.getItem('userId');
    const jwtToken = localStorage.getItem('jwtToken');
  
    if (!userId || !jwtToken) {
      return throwError(() => new Error('User not authenticated or missing user ID/token.'));
    }
  
    const headers = {
      Authorization: `Bearer ${jwtToken}`,
    };
  
    const cancelBookingData = { bookingId: bookingId };
  
    return this.http.post(`${Constant.BASE_URI}${Constant.CancelBooking}`, cancelBookingData, { headers }).pipe(
      catchError((error: any) => {
        console.error('Error cancelling booking:', error);
        return throwError(() => error);
      })
    );
  }

  fetchUserBookings() {
    const userId = localStorage.getItem('userId');
    const jwtToken = localStorage.getItem('jwtToken');

    if (!userId || !jwtToken) {
      return throwError(() => new Error('User not authenticated or missing user ID/token.'));
    }
  
    const headers = {
      Authorization: `Bearer ${jwtToken}`,
    };
    
    return this.http.get(`${Constant.BASE_URI}${Constant.GetBusById}${userId}`).pipe(
      catchError((error: any) => {
        console.error('Error fetching user details:', error);
        return throwError(() => error);
      })
    );

  }
  
  

}
