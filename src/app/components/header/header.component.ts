import { Component } from '@angular/core';
import { RouterLink,RouterLinkActive } from '@angular/router';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink,RouterLinkActive,FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  
  
})
export class HeaderComponent {

}
