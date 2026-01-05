import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router'; // Importa Router
import { ToastrService } from 'ngx-toastr';
import { RestBackendService } from '../_services/rest-backend/rest-backend.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-admin-area',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, NgIf],
  templateUrl: './admin-area.component.html',
  styleUrl: './admin-area.component.scss'
})
export class AdminAreaComponent implements OnInit {

  private toastr = inject(ToastrService);
  private restService = inject(RestBackendService);
  private router = inject(Router); // Iniezione del router per tornare alla home

  isLoading = false; // Usiamo questo per lo spinner del bottone

  agentForm = new FormGroup({
    name: new FormControl('', Validators.required),
    surname: new FormControl('', Validators.required),
    phone: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(16)
    ])
  });

  ngOnInit() {
    
  }

  

  handleCreateAgent() {
    if (this.agentForm.invalid) {
      this.toastr.warning('Per favore, compila tutti i campi correttamente.', 'Dati non validi');
      return;
    }

    const creatorAdminId = this.restService.getUserIdFromToken();

    if (!creatorAdminId) {
      this.toastr.error('Errore di autenticazione o agenzia non trovata.', 'Errore');
      return;
    }

    this.isLoading = true; // Attiva lo stato di caricamento

    // 2️⃣ Creazione dell'agente usando l'agencyId già caricato in ngOnInit
    this.restService.createAgent({
      creatorAdminId: creatorAdminId,
      email: this.agentForm.value.email as string,
      password: this.agentForm.value.password as string,
      name: this.agentForm.value.name as string,
      surname: this.agentForm.value.surname as string,
      phone: this.agentForm.value.phone as string
    }).subscribe({
      next: () => {
        // Feedback di successo
        this.toastr.success(
          `L'agente ${this.agentForm.value.name} è stato registrato con successo!`,
          'Congratulazioni! 🎉'
        );

        this.agentForm.reset();
        this.isLoading = false;

        // Ritorno alla homepage
        this.router.navigate(['/']); 
      },
      error: (err) => {
        this.toastr.error('Errore durante la creazione dell\'agente.', 'Operazione fallita');
        this.isLoading = false;
      }
    });
  }
}