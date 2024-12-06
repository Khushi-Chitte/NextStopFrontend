import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { API_URL } from '../../Constants';

@Injectable({
  providedIn: 'root'
})
export class GetAllBusesAPIService {
  incomingData = signal<any[]>([]);

  constructor(private http:HttpClient) { }

  fetchData(){
    this.http.get<any[]>(API_URL + 'Bus/GetAllBuses').subscribe(
      (result) => this.incomingData.set(result)
    );
   }
}
