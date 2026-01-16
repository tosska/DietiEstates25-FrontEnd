import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router'; 
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
  private router = inject(Router);

  isLoading = false;

  agentForm = new FormGroup({
    name: new FormControl('', Validators.required),
    surname: new FormControl('', Validators.required),
    phone: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(16)
    ]),
    // --- NUOVI CAMPI AGENTE ---
    vatNumber: new FormControl('', Validators.required),
    yearsExperience: new FormControl('', [Validators.required, Validators.min(0)])
    // --------------------------
  });

  ngOnInit() {}

  handleCreateAgent() {
    if (this.agentForm.invalid) {
      this.toastr.warning('Per favore, compila tutti i campi correttamente.', 'Dati non validi');
      this.agentForm.markAllAsTouched(); // Evidenzia gli errori
      return;
    }

    const creatorAdminId = this.restService.getUserIdFromToken();

    if (!creatorAdminId) {
      this.toastr.error('Errore di autenticazione o agenzia non trovata.', 'Errore');
      return;
    }

    this.isLoading = true;

    this.restService.createAgent({
      creatorAdminId: creatorAdminId,
      email: this.agentForm.value.email as string,
      password: this.agentForm.value.password as string,
      name: this.agentForm.value.name as string,
      surname: this.agentForm.value.surname as string,
      phone: this.agentForm.value.phone as string,
      // Mappatura nuovi campi
      vatNumber: this.agentForm.value.vatNumber as string,
      yearsExperience: Number(this.agentForm.value.yearsExperience)
    }).subscribe({
      next: () => {
        this.toastr.success(
          `L'agente ${this.agentForm.value.name} è stato registrato con successo!`,
          'Congratulazioni! 🎉'
        );

        this.agentForm.reset();
        this.isLoading = false;
        this.router.navigate(['/']); 
      },
      error: (err) => {
        console.error(err);
        const msg = err.error?.message || 'Errore durante la creazione dell\'agente.';
        this.toastr.error(msg, 'Operazione fallita');
        this.isLoading = false;
      }
    });
  }
}