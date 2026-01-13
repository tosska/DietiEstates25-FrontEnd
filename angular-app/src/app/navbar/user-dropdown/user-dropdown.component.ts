import { Component, effect, ElementRef, HostListener, inject } from '@angular/core';
import { AuthService } from '../../_services/auth/auth.service';
import { CustomerBackendService } from '../../_services/customer-backend/customer-backend.service';
import { AgencyBackendService } from '../../_services/agency-backend/agency-backend.service';
import { Customer } from '../../_services/customer-backend/customer';
import { Agent } from '../../_services/agency-backend/agent';
import { Router, RouterLink } from '@angular/router';
import { SocialAuthService } from '@abacritt/angularx-social-login';

@Component({
  selector: 'app-user-dropdown',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './user-dropdown.component.html',
  styleUrl: './user-dropdown.component.scss'
})
export class UserDropdownComponent {

  // INPUT: Accetta solo il ruolo dell'utente
  userRole: string | null = null;
  authService = inject(AuthService);
  agencySerice = inject(AgencyBackendService);
  customerService = inject(CustomerBackendService);

  // Modificato il tipo per accettare anche Admin (usiamo any se non hai l'interfaccia Admin)
  activeUser: Agent | Customer | any | null = null;
  isDropdownOpen: boolean = false;

  constructor(private router: Router, private elRef: ElementRef, private socialAuthService: SocialAuthService) {

    effect(() => {
      // Registra la dipendenza dal segnale di aggiornamento
      this.authService.userProfileUpdated();

      const isAuthenticated = this.authService.isAuthenticated();
      const userId = this.authService.userId();
      this.userRole = this.authService.role();

      if (isAuthenticated && userId && this.userRole) {
        this.fetchUserDetails(this.userRole, userId);
      } else {
        this.activeUser = null;
      }
    });
  }

  ngOnInit() {
    const isAuthenticated = this.authService.isAuthenticated();
    const userId = this.authService.userId();
    this.userRole= this.authService.role();

    if (isAuthenticated && userId && this.userRole) {
      this.fetchUserDetails(this.userRole, userId);
    } else {
      this.activeUser = null;
    }
    console.log('Navbar init, isAuthenticated:', this.authService.isUserAuthenticated());
  }

  fetchUserDetails(role: string, userId: number) {

    if (role == "agent") {
      this.agencySerice.getAgentById(userId!).subscribe({
        next: (agent) => {
          console.log("Agent details:", agent);
          this.activeUser = agent as Agent;
        },
        error: (err) => console.error("Errore fetch agent", err)
      });
    }

    if (role == "customer") {
      this.customerService.getCustomerById(userId!).subscribe({
        next: (customer) => {
          console.log("Customer details:", customer);
          this.activeUser = customer as Customer;
        },
        error: (err) => console.error("Errore fetch customer", err)
      });
    }

    // --- AGGIUNTO QUESTO BLOCCO ---
    if (role == "admin" || role == "manager") {
      this.agencySerice.getAdminById(userId!).subscribe({
        next: (admin) => {
          console.log("Admin details:", admin);
          this.activeUser = admin; // Assicurati che l'oggetto admin abbia la proprietà 'name'
        },
        error: (err) => console.error("Errore fetch admin", err)
      });
    }
    // ------------------------------
  }

  // Chiude il menu se si clicca all'esterno del componente
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.isDropdownOpen && !this.elRef.nativeElement.contains(event.target)) {
      this.isDropdownOpen = false;
    }
  }

  toggleDropdown(event: Event) {
    event.stopPropagation();
    this.isDropdownOpen = !this.isDropdownOpen;
  }

}