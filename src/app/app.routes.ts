import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { LoginComponent } from './components/login/login.component';

export const routes: Routes = [
    { path: 'app-home', component: HomeComponent },
    { path: 'app-registration', component:RegistrationComponent},
    { path: 'app-login', component:LoginComponent},
    { path: '', redirectTo: '/app-home', pathMatch: 'full' }
];
