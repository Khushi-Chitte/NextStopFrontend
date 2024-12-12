import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Constant } from '../components/Constants/constant';
import { catchError, forkJoin, map, Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {

  constructor(private http:HttpClient) { }

   fetchBusSeats(busId: number): Observable<any[]> {
    return this.http.get<any[]>(`${Constant.BASE_URI}${Constant.GetSeatsByBusId}${busId}`).pipe(
      catchError((error) => {
        console.error('Error fetching bus seats:', error);
        return throwError(() => new Error('Error fetching bus seats.'));
      })
    );
  }

  fetchScheduledSeatsByScheduleId(scheduleId: number): Observable<any[]> {
    return this.http.get<any[]>(`${Constant.BASE_URI}${Constant.GetScheduledSeatsByScheduleId}${scheduleId}`).pipe(
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

    if(!userId) {
      return throwError(() => new Error('missing user ID'));
    }


    return this.http.get(`${Constant.BASE_URI}${Constant.GetUserById}${userId}`).pipe(
      catchError((error: any) => {
        console.error('Error fetching user details:', error);
        return throwError(() => error);
      })
    );

   }

   updateUser(userData: any): Observable<any> {
    const userId = localStorage.getItem('userId');
  
    if (!userId) {
      return throwError(() => new Error('missing user ID'));
    }
  
    return this.http.put(`${Constant.BASE_URI}${Constant.UpdateUser}${userId}`, userData).pipe(
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
    return this.http.post(`${Constant.BASE_URI}${Constant.BookTicket}`, bookTicketData).pipe(
      catchError((error: any) => {
        console.error('Error fetching user details:', error);
        return throwError(() => error);
      })
    );
  }

  updatePayment(updatePaymentData: any): Observable<any> {
    return this.http.post(`${Constant.BASE_URI}${Constant.UpdatePayment}`, updatePaymentData).pipe(
      catchError((error: any) => {
        console.error('Error fetching user details:', error);
        return throwError(() => error);
      })
    );
  }

  cancelBooking(bookingId: number): Observable<any> {
    const cancelBookingData = { bookingId: bookingId };
  
    return this.http.post(`${Constant.BASE_URI}${Constant.CancelBooking}`, cancelBookingData).pipe(
      catchError((error: any) => {
        console.error('Error cancelling booking:', error);
        return throwError(() => error);
      })
    );
  }

  fetchUserBookings() : Observable<any> {
    const userId = localStorage.getItem('userId');

    if (!userId) {
      return throwError(() => new Error('missing user ID.'));
    }
    
    return this.http.get(`${Constant.BASE_URI}${Constant.BookingsByUserId}${userId}`).pipe(
      catchError((error: any) => {
        console.error('Error fetching booking:', error);
        return throwError(() => error);
      })
    );

  }

  fetchUserBookingByBookingId(bookingId: any) : Observable<any> {
    return this.http.get(`${Constant.BASE_URI}${Constant.BookingByBookingId}${bookingId}`).pipe(
      catchError((error: any) => {
        console.error('Error fetching booking details:', error);
        return throwError(() => error);
      })
    );
  }

  refundPaymentUpdate(bookingId: number) : Observable<any> {
    const refundPaymentData = {
      bookingId: bookingId
    }

    return this.http.post(`${Constant.BASE_URI}${Constant.UpdatePaymentToRefund}`, refundPaymentData).pipe(
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
    return this.http.get(`${Constant.BASE_URI}${Constant.PaymentStatus}${bookingId}`).pipe(
      catchError((error: any) => {
        console.error('Error fetching Payment Status:', error);
        return throwError(() => error);
      })
    );
  }

  createRoute(routeData: any) : Observable<any> {

    return this.http.post(`${Constant.BASE_URI}${Constant.CreateRoute}`, routeData).pipe(
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
    return this.http.put(`${Constant.BASE_URI}${Constant.UpdateRoute}${routeId}`, routeData).pipe(
      catchError((error: any) => {
        console.error('Error updating route:', error);
        return throwError(() => error);
      })
    );
  }

  deleteRoute(routeId: number): Observable<any> {
    return this.http.delete(`${Constant.BASE_URI}${Constant.DeleteRoute}${routeId}`).pipe(
      catchError((error: any) => {
        console.error('Error deleting route:', error);
        return throwError(() => error);
      })
    );
  }

  createBus(busData: any) : Observable<any> {
    return this.http.post(`${Constant.BASE_URI}${Constant.CreateBus}`, busData).pipe(
      catchError((error: any) => {
        console.error('Error create bus:', error);
        return throwError(() => error);
      })
    );
  }

  deleteBus(busId: number): Observable<any> {
    return this.http.delete(`${Constant.BASE_URI}${Constant.DeleteBus}${busId}`).pipe(
      catchError((error: any) => {
        console.error('Error deleting bus:', error);
        return throwError(() => error);
      })
    );
  }

  fetchSeatLogs(bookingId: number) : Observable<any> {
    return this.http.get(`${Constant.BASE_URI}${Constant.ViewSeatLogs}${bookingId}`).pipe(
      catchError((error: any) => {
        console.error('Error fetching Payment Status:', error);
        return throwError(() => error);
      })
    );
  }

  fetchAllBuses() : Observable<any> {
    return this.http.get(`${Constant.BASE_URI}${Constant.GetAllBuses}`).pipe(
      catchError((error: any) => {
        console.error('Error fetching buses:', error);
        return throwError(() => error);
      })
    );
  }

  fetchBusesByOperatorId() : Observable<any> {
    const userId = localStorage.getItem('userId');

    if (!userId) {
      return throwError(() => new Error('missing user ID'));
    }


    const operatorId = userId;

    return this.http.get(`${Constant.BASE_URI}${Constant.GetBusesByOperatorId}${operatorId}`).pipe(
      catchError((error: any) => {
        console.error('Error fetching buses:', error);
        return throwError(() => error);
      })
    );
  }

  updateBus(busId: number, busData: any): Observable<any> {
    return this.http.put(`${Constant.BASE_URI}${Constant.UpdateBus}${busId}`, busData).pipe(
      catchError((error: any) => {
        console.error('Error updating bus:', error);
        return throwError(() => error);
      })
    );
  }

  fetchAllSchedules(): Observable<any> {
    return this.http.get(`${Constant.BASE_URI}${Constant.GetAllSchedules}`).pipe(
      catchError((error: any) => {
        console.error('Error fetching schedules:', error);
        return throwError(() => error);
      })
    );
  }

  fetchSchedulesByBusId(busId: any) : Observable<any> {
    return this.http.get(`${Constant.BASE_URI}${Constant.GetSchedulesByBusId}${busId}`).pipe(
      catchError((error: any) => {
        console.error('Error fetching Payment Status:', error);
        return throwError(() => error);
      })
    );
  }

  fetchSchedulesByOperatorId() : Observable<any> {
    const userId = localStorage.getItem('userId');

    if (!userId) {
      return throwError(() => new Error('missing user ID'));
    }


    const operatorId = userId;
    return this.http.get(`${Constant.BASE_URI}${Constant.GetSchedulesByOperatorId}${operatorId}`).pipe(
      catchError((error: any) => {
        console.error('Error fetching Payment Status:', error);
        return throwError(() => error);
      })
    );
  }

  fetchOperatorByBusId(busId: number) {
    return this.http.get(`${Constant.BASE_URI}${Constant.GetOperatorByBusId}${busId}`).pipe(
      catchError((error: any) => {
        console.error('Error fetching Payment Status:', error);
        return throwError(() => error);
      })
    );
  }
  
  createSchedule(scheduleData: any) : Observable<any> {
    return this.http.post(`${Constant.BASE_URI}${Constant.CreateSchedule}`, scheduleData).pipe(
      catchError((error: any) => {
        console.error('Error create schedule:', error);
        return throwError(() => error);
      })
    );
  }

  updateSchedule(scheduleId: number, scheduleData: any): Observable<any> {
    return this.http.put(`${Constant.BASE_URI}${Constant.UpdateSchedule}${scheduleId}`, scheduleData).pipe(
      catchError((error: any) => {
        console.error('Error updating schedule:', error);
        return throwError(() => error);
      })
    );
  }

  deleteSchedule(scheduleId: number): Observable<any> {
    return this.http.delete(`${Constant.BASE_URI}${Constant.DeleteSchedule}${scheduleId}`).pipe(
      catchError((error: any) => {
        console.error('Error deleting schedule:', error);
        return throwError(() => error);
      })
    );
  } 

  genReport(genReportData: any) : Observable<any> {
    return this.http.post(`${Constant.BASE_URI}${Constant.GenerateReports}`, genReportData).pipe(
      catchError((error: any) => {
        console.error('Error generating reports:', error);
        return throwError(() => error);
      })
    );
  }

  fetchAllUsers() : Observable<any> {
    return this.http.get(`${Constant.BASE_URI}${Constant.FetchAllUsers}`).pipe(
      catchError((error: any) => {
        console.error('Error fetching users:', error);
        return throwError(() => error);
      })
    );
  }
  
  sendNotification(notifData: any): Observable<any> {
    return this.http.post(`${Constant.BASE_URI}${Constant.SendNotification}`, notifData).pipe(
      catchError((error: any) => {
        console.error('Error fetching users:', error);
        return throwError(() => error);
      })
    );
  }

  viewNotifications(): Observable<any> {
    const userId = localStorage.getItem('userId');
  
    if (!userId) {
      return throwError(() => new Error('Missing user ID'));
    }
  
    return this.http.get(`${Constant.BASE_URI}${Constant.ViewNotification}${userId}`).pipe(
      catchError((error: any) => {
        if (error.status === 404 && error.error === "No notifications found for this user.") {
          return of([]);  
        } else {
          console.error('Error fetching notifications:', error);
          return throwError(() => error);
        }
      })
    );
  }
  

  markNotifRead(notificationId: number): Observable<any> {
    return this.http.post(`${Constant.BASE_URI}${Constant.MarkNotificationAsRead}${notificationId}`, {}).pipe(
      catchError((error: any) => {
        console.error('Error marking notification as read:', error);
        return throwError(() => error);
      })
    );
  }  

  updateUserByAdmin(userData: any): Observable<any> {
  
    return this.http.put(`${Constant.BASE_URI}${Constant.UpdateUser}${userData.userId}`, userData).pipe(
      catchError((error: any) => {
        console.error('Error updating user details:', error);
        return throwError(() => error);
      })
    );
  }

  deleteUserByAdmin(userId: any): Observable<any> {
    return this.http.post(`${Constant.BASE_URI}${Constant.DeleteUser}${userId}`,{}).pipe(
      catchError((error: any) => {
        console.error('Error deleting user:', error);
        return throwError(() => error);
      })
    );
  }

  reactivateUserByAdmin(userId: any): Observable<any> {
    return this.http.get(`${Constant.BASE_URI}${Constant.ReactivateUser}${userId}`).pipe(
      catchError((error: any) => {
        console.error('Error deleting user:', error);
        return throwError(() => error);
      })
    );
  }

}
