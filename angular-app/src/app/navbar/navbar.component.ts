import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { DarkModeToggleComponent } from './dark-mode-toggle/dark-mode-toggle.component';
import { AuthService } from '../_services/auth/auth.service';
import { AgencyBackendService } from '../_services/agency-backend/agency-backend.service';
import { CustomerBackendService } from '../_services/customer-backend/customer-backend.service';
import { Agent } from '../_services/agency-backend/agent';
import { Customer } from '../_services/customer-backend/customer';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, DarkModeToggleComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  routerLinkActive: any;
  ngOnInit() {
    this.fetchUserDetails();
    console.log('Navbar init, isAuthenticated:', this.authService.isUserAuthenticated());
  }
  
  isOpen = false;
  isDropdownOpen = false;
  
  authService = inject(AuthService);
  agencySerice = inject(AgencyBackendService);
  customerService = inject(CustomerBackendService);

  activeUser: Agent | Customer | null = null;

  toggle() {
    this.isOpen = !this.isOpen;
  }

  fetchUserDetails() {
    const role = this.authService.role();
    const userId = this.authService.userId();

    if(role=="agent") {
      this.agencySerice.getAgentById(userId!).subscribe({
        next: (agent) => {
          console.log("Agent details:", agent); 
          this.activeUser = agent as Agent;
        }
      });
    }

    if(role=="customer") {
      this.customerService.getCustomerById(userId!).subscribe({
        next: (customer) => {
          console.log("Customer details:", customer); 
          this.activeUser = customer as Customer;
        }
      });
    }
  }

  handleNavigationClick() {
    this.isOpen = false;
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
}