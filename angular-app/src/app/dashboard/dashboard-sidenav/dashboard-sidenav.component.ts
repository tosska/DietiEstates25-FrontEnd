import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AgencyBackendService } from '../../_services/agency-backend/agency-backend.service';
import { AuthService } from '../../_services/auth/auth.service';
import { Agent } from '../../_services/agency-backend/agent';

@Component({
  selector: 'app-dashboard-sidenav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './dashboard-sidenav.component.html',
  styleUrl: './dashboard-sidenav.component.scss'
})
export class DashboardSidenavComponent {

  agentName: string | null = null;
  agentImageUrl: string | null = null;

  agencyService = inject(AgencyBackendService);
  authService = inject(AuthService);  

  ngOnInit(): void {
    this.getAgentName();
  }

  getAgentName(): void {

    const userId = this.authService.getUserId();
    console.log('User ID ottenuto dal AuthService:', userId);
    this.agencyService.getAgentById(userId!).subscribe({
      next: (agent) => {
        const tempAgent = agent as Agent;
        this.agentName = tempAgent.name + ' ' + tempAgent.surname;
        this.agentImageUrl = this.agencyService.getAgentImageUrl(tempAgent.id, tempAgent.urlPhoto!);
      },
      error: (error) => {
        console.error('Errore durante il recupero del nome dell\'agente:', error);
      }
    });
  }

}
