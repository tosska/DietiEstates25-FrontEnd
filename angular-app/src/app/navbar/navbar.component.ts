import { Component, effect, inject } from '@angular/core';
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

  constructor() {
    // 👇 Reagisce automaticamente a ogni cambiamento nel signal `authState`
    effect(() => {
      const isAuthenticated = this.authService.isAuthenticated();
      const userId = this.authService.userId();
      const role = this.authService.role();

      if (isAuthenticated && userId && role) {
        this.fetchUserDetails(role, userId);
      } else {
        this.activeUser = null;
      }
    });
  }
  
  ngOnInit() {
    const isAuthenticated = this.authService.isAuthenticated();
    const userId = this.authService.userId();
    const role = this.authService.role();

    if (isAuthenticated && userId && role) {
      this.fetchUserDetails(role, userId);
    } else {
      this.activeUser = null;
    }
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

  fetchUserDetails(role: string, userId: number) {

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