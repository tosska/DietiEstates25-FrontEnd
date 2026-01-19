import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router'; // Aggiungi RouterLink
import { DashboardSidenavComponent } from './dashboard-sidenav/dashboard-sidenav.component';
import { NgClass } from '@angular/common'; // Se serve

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterOutlet, DashboardSidenavComponent, RouterLink], // Aggiungi RouterLink qui
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  // Iniettiamo il Router per controllare l'URL corrente
  public router = inject(Router);
}