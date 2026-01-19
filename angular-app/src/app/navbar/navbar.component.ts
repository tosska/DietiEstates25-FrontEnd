import { Component, effect, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { AuthService } from '../_services/auth/auth.service';
import { AgencyBackendService } from '../_services/agency-backend/agency-backend.service';
import { CustomerBackendService } from '../_services/customer-backend/customer-backend.service';
import { Agent } from '../_services/agency-backend/agent';
import { Customer } from '../_services/customer-backend/customer';
import { UserDropdownComponent } from './user-dropdown/user-dropdown.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, UserDropdownComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  routerLinkActive: any;
  userDropDownIsOpen: boolean = false;

  isOpen = false;
  isDropdownOpen = false;
  authService = inject(AuthService);


  constructor() {


  }
  

  
  toggle() {
    this.isOpen = !this.isOpen;
  }


  handleNavigationClick() {
    this.isOpen = false;
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
}