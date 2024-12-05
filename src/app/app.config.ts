import { ApplicationConfig } from '@angular/core';
import { provideRouter,Routes } from '@angular/router';
import { Route } from '@angular/router';
import { RegistrationComponent } from './components/registration/registration.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';


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
  
]

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes)]
};
