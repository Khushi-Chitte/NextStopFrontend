import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { FormsModule } from '@angular/forms';
import { AuthserviceService } from './services/authservice.service';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,HeaderComponent,FooterComponent,FormsModule, MatDialogModule,CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'NextStop-Frontend';

  constructor(private authService: AuthserviceService) {
    this.authService.checkAuthStatus(); 
   }

  ngOnInit(): void {
    // Check authentication status when the app initializes
    this.authService.checkAuthStatus();
  }
  
}
