import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, catchError, Observable, of, tap, throwError } from 'rxjs';
import { Constant } from '../components/Constants/constant';
import { jwtDecode } from 'jwt-decode';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationService } from './notification.service';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthserviceService implements OnInit{

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false); 
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient, private snackBar: MatSnackBar, private router: Router ) {
  const token = this.getToken();
  const isAuthenticated = !!token;
  this.setAuthStatus(isAuthenticated);
}


  ngOnInit(): void {
    const token = this.getToken();
    const isAuthenticated = !!token;
    this.setAuthStatus(isAuthenticated);
  }

  setAuthStatus(isAuthenticated: boolean): void {
    this.isAuthenticatedSubject.next(isAuthenticated);
  }

  checkAuthStatus(): void {
    const token = this.getToken();
    if (token) {
      const expiryDate = this.getTokenExpiry();

      if (expiryDate && expiryDate > new Date()) {
        // Token is valid, set authentication to true
        this.setAuthStatus(true);
      } else {
        // Token has expired, log out automatically
        this.logout(this.getRefreshToken()).subscribe(() => {
          console.log('Token expired, logged out automatically');
          this.snackBar.open('Token expired, logged out automatically', 'Close', {
            duration: 3000, 
            horizontalPosition: 'right',
            verticalPosition: 'bottom',
          });
          this.setAuthStatus(false); 
          this.removeToken();
          this.removeRefreshToken();
          this.removeEmail();
          this.removeUserId();
          this.router.navigate(['/app-login']);
          alert('Token expired, logged out automatically');
        });
      }
    } else {
      // No token, user is not authenticated
      this.setAuthStatus(false);
    }
  }

  login(email: string, password: string) : Observable<any> {
    const loginData = {
      email: email,  
      password: password
    };

    return this.http.post(Constant.BASE_URI + Constant.LOGIN, loginData).pipe(
      catchError((error: any) => {
        console.error(error);
        return throwError(() => (error));  
      })
    );
  }

  register(name: string, email: string, password: string, phone: string, address: string, role: string, isActive: boolean) : Observable<any> {
    const registerData = {
      name: name,
      email: email,
      password: password,
      phone: phone,
      address: address,
      role: role,
      isActive: true
    }

    return this.http.post(Constant.BASE_URI + Constant.REGISTER, registerData).pipe(
      catchError((error: any) => {
        console.error(error);
        return throwError(() => (error));
      })
    );
  }

  logout(refreshToken: string | null): Observable<any> {
    const logoutData = {
      refreshToken: refreshToken
    }
    
    if (!logoutData.refreshToken) {
      console.error('No refresh token found');
      return of({ success: false, message: 'No refresh token found' });
    }

    console.log('Sending refresh token to logout:', logoutData);

    return this.http.post(Constant.BASE_URI + Constant.LOGOUT, logoutData).pipe(
      
      catchError((error: any) => {
        console.error('Error during logout', error);
        return of({ success: false, message: 'Logout failed' });
      }),
      tap(response => {
        console.log('Server response:', response);
      })
    );
  }
  

  getToken(): string | null {
    return localStorage.getItem('jwtToken');
  }

  setToken(jwtToken: string): void {
    localStorage.setItem('jwtToken', jwtToken);
    this.setAuthStatus(true);
  }

  removeToken(): void {
    localStorage.removeItem('jwtToken');
    this.setAuthStatus(false);
  }

  

  decodeToken(): any | null {
  const jwtToken = this.getToken();
  if (!jwtToken) return null;

  try {
    return jwtDecode(jwtToken); // Returns decoded payload
  } catch (error) {
    console.error('Failed to decode token:', error);
    this.removeToken(); // Remove corrupted token
    this.setAuthStatus(false);
    return null;
  }
}


  getTokenExpiry(): Date | null {
    const decodedToken = this.decodeToken();
    if (decodedToken && decodedToken.exp) {
      // Convert the exp value from Unix timestamp to a Date object
      const expiryDate = new Date(decodedToken.exp * 1000); // Multiply by 1000 to convert seconds to milliseconds
      return expiryDate;
    }
    return null;
  }

  getUserRoles() : string | null {
    const decodedToken = this.decodeToken();
    if(decodedToken) {
      const role = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
      return role;
    }
    return null;
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  setRefreshToken(refreshToken: string): void {
    localStorage.setItem('refreshToken', refreshToken);
  }

  removeRefreshToken(): void {
    localStorage.removeItem('refreshToken');
  }

  getUserId(): number | null {
    const userId = localStorage.getItem('userId');
    return userId ? Number(userId) : null;
  }

  setUserId(userId: number): void {
    localStorage.setItem('userId', userId.toString()); 
  }

  removeUserId(): void {
    localStorage.removeItem('userId');
  }

  getEmail(): string | null {
    return localStorage.getItem('email');
  }
  
  setEmail(email: string): void {
    localStorage.setItem('email', email);
  }
  
  removeEmail(): void {
    localStorage.removeItem('email');
  }

}