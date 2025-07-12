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
  ngOnInit() {
    console.log('Navbar init, isAuthenticated:', this.authService.isUserAuthenticated());
  }
  
  isOpen = false;
  isDropdownOpen = false;
  
  authService = inject(AuthService);

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