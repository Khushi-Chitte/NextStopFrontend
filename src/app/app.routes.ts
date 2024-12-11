import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { LoginComponent } from './components/login/login.component';
import { ViewresultsComponent } from './components/viewresults/viewresults.component';
import { BookBusComponent } from './components/book-bus/book-bus.component';
import { ProfileComponent } from './components/profile/profile.component';
import { UpdateProfileComponent } from './components/update-profile/update-profile.component';
import { ConfirmBookingComponent } from './components/confirm-booking/confirm-booking.component';
import { BookingsComponent } from './components/bookings/bookings.component';
import { ViewBookingComponent } from './components/view-booking/view-booking.component';
import { AboutComponent } from './components/about/about.component';
import { ManageRoutesComponent } from './components/manage-routes/manage-routes.component';
import { ManageBusesComponent } from './components/manage-buses/manage-buses.component';
import { ManageSchedulesComponent } from './components/manage-schedules/manage-schedules.component';
import { authGuard } from './guards/auth.guard';
import { GenReportsComponent } from './components/gen-reports/gen-reports.component';
import { passengerGuard } from './guards/passenger.guard';
import { adminGuard } from './guards/admin.guard';
import { adminOperatorGuard } from './guards/admin-operator.guard';
import { ViewRoutesComponent } from './components/view-routes/view-routes.component';
import { adminOperatorPassengerGuard } from './guards/admin-operator-passenger.guard';

export const routes: Routes = [
    { path: 'app-home', component: HomeComponent },
    { path: 'app-registration', component: RegistrationComponent, canActivate: [authGuard] },
    { path: 'app-login', component: LoginComponent, canActivate: [authGuard] },
    { path: 'app-viewresults', component: ViewresultsComponent },
    { path: 'app-book-bus', component: BookBusComponent, canActivate: [passengerGuard] },
    { path: 'app-profile', component: ProfileComponent, canActivate: [adminOperatorPassengerGuard] },
    { path: 'app-update-profile', component: UpdateProfileComponent, canActivate: [adminOperatorPassengerGuard] },
    { path: 'app-confirm-booking', component: ConfirmBookingComponent, canActivate: [passengerGuard] },
    { path: 'app-bookings', component: BookingsComponent, canActivate: [passengerGuard] },
    { path: 'app-view-booking', component: ViewBookingComponent, canActivate: [passengerGuard] },
    { path: 'app-confirm-cancel-booking', component: ConfirmBookingComponent, canActivate: [passengerGuard] },
    { path: 'app-view-routes', component: ViewRoutesComponent },
    { path: 'app-manage-routes', component: ManageRoutesComponent, canActivate:  [adminGuard] },
    { path: 'app-manage-buses', component: ManageBusesComponent, canActivate: [adminOperatorGuard] },
    { path: 'app-manage-schedules', component: ManageSchedulesComponent, canActivate: [adminOperatorGuard] },
    { path:'app-about', component:AboutComponent},
    { path: 'app-gen-reports', component: GenReportsComponent, canActivate: [adminGuard] },
    { path: '', redirectTo: '/app-home', pathMatch: 'full' },
];
