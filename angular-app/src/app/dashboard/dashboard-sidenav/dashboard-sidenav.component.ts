import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-dashboard-sidenav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './dashboard-sidenav.component.html',
  styleUrl: './dashboard-sidenav.component.scss'
})
export class DashboardSidenavComponent {

}
