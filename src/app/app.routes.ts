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
import { NotificationComponent } from './components/notification/notification.component';
import { AboutComponent } from './components/about/about.component';
import { ManageRoutesComponent } from './components/manage-routes/manage-routes.component';
import { ManageBusesComponent } from './components/manage-buses/manage-buses.component';
import { ManageSchedulesComponent } from './components/manage-schedules/manage-schedules.component';
import { authGuard } from './guards/auth.guard';
import { GenReportsComponent } from './components/gen-reports/gen-reports.component';

export const routes: Routes = [
    { path: 'app-home', component: HomeComponent },
    { path: 'app-registration', component: RegistrationComponent, canActivate: [authGuard] },
    { path: 'app-login', component: LoginComponent, canActivate: [authGuard] },
    { path: 'app-viewresults', component: ViewresultsComponent },
    { path: 'app-book-bus', component: BookBusComponent },
    { path: 'app-profile', component: ProfileComponent },
    { path: 'app-update-profile', component: UpdateProfileComponent },
    { path: 'app-confirm-booking', component: ConfirmBookingComponent },
    { path: 'app-bookings', component: BookingsComponent },
    { path: 'app-view-booking', component: ViewBookingComponent },
    { path: 'app-confirm-cancel-booking', component: ConfirmBookingComponent },
    { path: 'app-manage-routes', component: ManageRoutesComponent },
    { path: 'app-manage-buses', component: ManageBusesComponent },
    { path: 'app-manage-schedules', component: ManageSchedulesComponent },
    { path:'app-about', component:AboutComponent},
    { path: 'app-notification', component: NotificationComponent },
    { path: 'app-gen-reports', component: GenReportsComponent },
    { path: '', redirectTo: '/app-home', pathMatch: 'full' },
];
