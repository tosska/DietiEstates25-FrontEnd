import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router'; // Importa Router
import { ToastrService } from 'ngx-toastr';
import { RestBackendService } from '../_services/rest-backend/rest-backend.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-manager-area',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, NgIf],
  templateUrl: './manager-area.component.html',
  styleUrl: './manager-area.component.scss'
})
export class ManagerAreaComponent implements OnInit {

  private toastr = inject(ToastrService);
  private restService = inject(RestBackendService);
  private router = inject(Router); // Iniezione del router per tornare alla home

  isLoading = false; // Usiamo questo per lo spinner del bottone

  adminForm = new FormGroup({
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

  

  handleCreateAdmin() {
    if (this.adminForm.invalid) {
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
    this.restService.createAdmin({
      creatorAdminId: creatorAdminId,
      email: this.adminForm.value.email as string,
      password: this.adminForm.value.password as string,
      name: this.adminForm.value.name as string,
      surname: this.adminForm.value.surname as string,
      phone: this.adminForm.value.phone as string
    }).subscribe({
      next: () => {
        // Feedback di successo
        this.toastr.success(
          `L'admin ${this.adminForm.value.name} è stato registrato con successo!`,
          'Congratulazioni! 🎉'
        );

        this.adminForm.reset();
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