import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { DarkModeToggleComponent } from './dark-mode-toggle/dark-mode-toggle.component';
import { AuthService } from '../_services/auth/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, DarkModeToggleComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  // navbar.component.ts
  ngOnInit() {
    console.log('Navbar init, isAuthenticated:', this.authService.isUserAuthenticated());
  }
  
  isOpen = false; //determines whether the mobile navbar is toggled or not
  isDropdownOpen = false;
  
  authService = inject(AuthService);

  /**
   * Handles user click on the navbar menu toggle on small screens
   */
  toggle() {
    this.isOpen = !this.isOpen;
  }

  /**
   * Closes the toggled navbar when a user clicks on a link
   */
  handleNavigationClick(){
    this.isOpen = false;
  }

  toggleDropdown(){
    this.isDropdownOpen = !this.isDropdownOpen;
  }
}
