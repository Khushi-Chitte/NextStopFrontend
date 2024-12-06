import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { LoginComponent } from './components/login/login.component';
import { ViewresultsComponent } from './components/viewresults/viewresults.component';
import { BookBusComponent } from './components/book-bus/book-bus.component';
import { BusComponent } from './components/bus/bus.component';

export const routes: Routes = [
    { path: 'app-home', component: HomeComponent },
    { path: 'app-registration', component:RegistrationComponent},
    { path: 'app-login', component:LoginComponent},
    { path: 'app-viewresults', component:ViewresultsComponent},
    { path: 'app-book-bus', component:BookBusComponent},
    { path: 'app-bus', component:BusComponent},
    { path: '', redirectTo: '/app-home', pathMatch: 'full' }
];
