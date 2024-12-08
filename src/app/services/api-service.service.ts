import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Constant } from '../components/Constants/constant';
import { catchError, map, Observable, of, throwError } from 'rxjs';

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

  fetchUserBookings() : Observable<any> {
    const userId = localStorage.getItem('userId');
    const jwtToken = localStorage.getItem('jwtToken');

    if (!userId || !jwtToken) {
      return throwError(() => new Error('User not authenticated or missing user ID/token.'));
    }
  
    const headers = {
      Authorization: `Bearer ${jwtToken}`,
    };
    
    return this.http.get(`${Constant.BASE_URI}${Constant.BookingsByUserId}${userId}`, { headers }).pipe(
      catchError((error: any) => {
        console.error('Error fetching booking:', error);
        return throwError(() => error);
      })
    );

  }

  fetchUserBookingByBookingId(bookingId: any) : Observable<any> {
    const userId = localStorage.getItem('userId');
    const jwtToken = localStorage.getItem('jwtToken');

    if (!userId || !jwtToken) {
      return throwError(() => new Error('User not authenticated or missing user ID/token.'));
    }

    const headers = {
      Authorization: `Bearer ${jwtToken}`,
    };

    return this.http.get(`${Constant.BASE_URI}${Constant.BookingByBookingId}${bookingId}`, { headers }).pipe(
      catchError((error: any) => {
        console.error('Error fetching booking details:', error);
        return throwError(() => error);
      })
    );
  }

  refundPaymentUpdate(bookingId: number) : Observable<any> {
    const userId = localStorage.getItem('userId');
    const jwtToken = localStorage.getItem('jwtToken');

    if (!userId || !jwtToken) {
      return throwError(() => new Error('User not authenticated or missing user ID/token.'));
    }

    const headers = {
      Authorization: `Bearer ${jwtToken}`,
    };

    const refundPaymentData = {
      bookingId: bookingId
    }

    return this.http.post(`${Constant.BASE_URI}${Constant.UpdatePaymentToRefund}`, refundPaymentData, { headers }).pipe(
      catchError((error: any) => {
        console.error('Unable to update refund db', error);
        return throwError(() => error);
      }),
      map((response: any) => {
        console.log('Refund payment response:', response);
        // Here you can access the properties of the response like:
        console.log(`Payment ID: ${response.paymentId}, Booking ID: ${response.bookingId}`);
        return response;  // You can return the response for further handling if needed
      })
    );
    
    
  }

  fetchPaymentStatus(bookingId: any) : Observable<any> {
    const userId = localStorage.getItem('userId');
    const jwtToken = localStorage.getItem('jwtToken');

    if (!userId || !jwtToken) {
      return throwError(() => new Error('User not authenticated or missing user ID/token.'));
    }

    const headers = {
      Authorization: `Bearer ${jwtToken}`,
    };

    return this.http.get(`${Constant.BASE_URI}${Constant.PaymentStatus}${bookingId}`, { headers }).pipe(
      catchError((error: any) => {
        console.error('Error fetching Payment Status:', error);
        return throwError(() => error);
      })
    );
  }

  createRoute(routeData: any) : Observable<any> {
    const userId = localStorage.getItem('userId');
    const jwtToken = localStorage.getItem('jwtToken');

    if (!userId || !jwtToken) {
      return throwError(() => new Error('User not authenticated or missing user ID/token.'));
    }

    const headers = {
      Authorization: `Bearer ${jwtToken}`,
    };

    return this.http.post(`${Constant.BASE_URI}${Constant.CreateRoute}`, routeData, { headers }).pipe(
      catchError((error: any) => {
        console.error('Error create route:', error);
        return throwError(() => error);
      })
    );

  }

  fetchAllRoutes() : Observable<any> {
    return this.http.get(`${Constant.BASE_URI}${Constant.ViewAllRoutes}`).pipe(
      catchError((error: any) => {
        console.error('Error fetching routes:', error);
        return throwError(() => error);
      })
    );
  }

  updateRoute(routeId: number, routeData: any): Observable<any> {
    const userId = localStorage.getItem('userId');
    const jwtToken = localStorage.getItem('jwtToken');

    if (!userId || !jwtToken) {
      return throwError(() => new Error('User not authenticated or missing user ID/token.'));
    }

    const headers = {
      Authorization: `Bearer ${jwtToken}`,
    };

    return this.http.put(`${Constant.BASE_URI}${Constant.UpdateRoute}${routeId}`, routeData, { headers }).pipe(
      catchError((error: any) => {
        console.error('Error updating route:', error);
        return throwError(() => error);
      })
    );
  }

  deleteRoute(routeId: number): Observable<any> {
    const userId = localStorage.getItem('userId');
    const jwtToken = localStorage.getItem('jwtToken');

    if (!userId || !jwtToken) {
      return throwError(() => new Error('User not authenticated or missing user ID/token.'));
    }

    const headers = {
      Authorization: `Bearer ${jwtToken}`,
    };

    return this.http.delete(`${Constant.BASE_URI}${Constant.DeleteRoute}${routeId}`, { headers }).pipe(
      catchError((error: any) => {
        console.error('Error deleting route:', error);
        return throwError(() => error);
      })
    );
  }
  
  

}
