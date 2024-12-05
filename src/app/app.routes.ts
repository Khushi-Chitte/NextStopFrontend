import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { LoginComponent } from './components/login/login.component';
<<<<<<< HEAD
import { ViewresultsComponent } from './components/viewresults/viewresults.component';
=======
>>>>>>> 0e6a1e318a02a9f3de91fc822967d8e15a98ba07

export const routes: Routes = [
    { path: 'app-home', component: HomeComponent },
    { path: 'app-registration', component:RegistrationComponent},
    { path: 'app-login', component:LoginComponent},
<<<<<<< HEAD
    { path: '', redirectTo: '/app-home', pathMatch: 'full' },
    { path: 'app-viewresults', component:ViewresultsComponent},

];
=======
    { path: '', redirectTo: '/app-home', pathMatch: 'full' }
];
>>>>>>> 0e6a1e318a02a9f3de91fc822967d8e15a98ba07
