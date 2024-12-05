import { ApplicationConfig } from '@angular/core';
import { provideRouter,Routes } from '@angular/router';
import { Route } from '@angular/router';
import { RegistrationComponent } from './components/registration/registration.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { ViewresultsComponent } from './components/viewresults/viewresults.component';


const routes:Routes=[
  { path: '', component: HomeComponent },
  {
      path:'app-registration',
      component:RegistrationComponent
  },
   {
      path:'app-login',
      component:LoginComponent
  },
  {
      path:'app-home',
      component:HomeComponent
  },
  {
    path:'app-viewresults',
    component: ViewresultsComponent
  }
  
]

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes)]
};
