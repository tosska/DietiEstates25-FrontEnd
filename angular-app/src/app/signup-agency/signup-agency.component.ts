import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RestBackendService } from '../_services/rest-backend/rest-backend.service';
import { Router, RouterModule } from '@angular/router';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Configura l'icona di default
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
});

@Component({
  selector: 'app-signup-agency',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule
  ],
  templateUrl: './signup-agency.component.html',
  styleUrls: ['./signup-agency.component.scss']
})
export class SignupAgencyComponent implements OnInit, AfterViewInit, OnDestroy {
  currentStep = 1;
  signupForm: FormGroup;
  mapCoordinates: { latitude: number; longitude: number } = { latitude: 45.46, longitude: 9.19 }; // Coordinate iniziali (Milano)
  private map: L.Map | undefined;
  private marker: L.Marker | undefined;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private restService: RestBackendService,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      step1: this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]]
      }),
      step2: this.fb.group({
        street: [''],
        city: [''],
        postalCode: [''],
        state: [''],
        unitDetail: [''],
        latitude: [this.mapCoordinates.latitude],
        longitude: [this.mapCoordinates.longitude]
      }),
      step3: this.fb.group({
        phone: ['', [Validators.required]],
        description: [''],
        vatNumber: ['', [Validators.required]],
        website: ['']
      })
    });

    // Sincronizza i campi del form con la mappa
    this.step2.get('latitude')?.valueChanges.subscribe(latitude => {
      this.mapCoordinates.latitude = parseFloat(latitude) || this.mapCoordinates.latitude;
      this.updateMapView();
      this.reverseGeocode();
    });
    this.step2.get('longitude')?.valueChanges.subscribe(longitude => {
      this.mapCoordinates.longitude = parseFloat(longitude) || this.mapCoordinates.longitude;
      this.updateMapView();
      this.reverseGeocode();
    });

    // Sincronizza i campi indirizzo con la mappa
    this.step2.get('street')?.valueChanges.subscribe(() => this.forwardGeocode());
    this.step2.get('city')?.valueChanges.subscribe(() => this.forwardGeocode());
    this.step2.get('postalCode')?.valueChanges.subscribe(() => this.forwardGeocode());
    this.step2.get('state')?.valueChanges.subscribe(() => this.forwardGeocode());
  }

  ngOnInit() {}

  ngAfterViewInit() {
    if (this.currentStep === 2) {
      this.initializeMap();
    }
  }

  ngOnDestroy() {
    if (this.map) {
      this.map.remove();
      this.map = undefined;
    }
    if (this.marker) {
      this.marker.remove();
    }
  }

  private initializeMap() {
    if (!this.map) {
      console.log('Inizializzazione mappa...');
      const mapElement = document.getElementById('map');
      if (!mapElement) {
        console.error('Elemento #map non trovato nel DOM');
        return;
      }
      this.map = L.map('map').setView([this.mapCoordinates.latitude, this.mapCoordinates.longitude], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(this.map);

      this.marker = L.marker([this.mapCoordinates.latitude, this.mapCoordinates.longitude], {
        draggable: true
      }).addTo(this.map).bindPopup('Posizione selezionata').openPopup();

      if (this.marker) {
        this.marker.on('dragend', (e: L.DragEndEvent) => {
          const latlng = e.target.getLatLng();
          this.mapCoordinates.latitude = latlng.lat;
          this.mapCoordinates.longitude = latlng.lng;
          this.step2.patchValue({
            latitude: this.mapCoordinates.latitude,
            longitude: this.mapCoordinates.longitude
          });
          this.reverseGeocode();
          this.marker?.setPopupContent(`Posizione: ${latlng.lat.toFixed(6)}, ${latlng.lng.toFixed(6)}`).openPopup();
        });
      }

      this.map.on('click', (event: L.LeafletMouseEvent) => {
        this.onMapClick(event);
      });

      // Inizializza i campi con la geolocalizzazione al caricamento
      this.reverseGeocode();
    }
  }

  private onMapClick(event: L.LeafletMouseEvent) {
    this.mapCoordinates.latitude = event.latlng.lat;
    this.mapCoordinates.longitude = event.latlng.lng;
    this.step2.patchValue({
      latitude: this.mapCoordinates.latitude,
      longitude: this.mapCoordinates.longitude
    });

    if (this.marker) {
      this.marker.setLatLng([event.latlng.lat, event.latlng.lng]);
      this.marker.setPopupContent(`Posizione: ${event.latlng.lat.toFixed(6)}, ${event.latlng.lng.toFixed(6)}`).openPopup();
    }

    this.reverseGeocode();
  }

  private updateMapView() {
    if (this.map && this.marker) {
      this.map.setView([this.mapCoordinates.latitude, this.mapCoordinates.longitude], 13);
      this.marker.setLatLng([this.mapCoordinates.latitude, this.mapCoordinates.longitude]);
      this.marker.setPopupContent(`Posizione: ${this.mapCoordinates.latitude.toFixed(6)}, ${this.mapCoordinates.longitude.toFixed(6)}`).openPopup();
    }
  }

  private reverseGeocode() {
    const url = `http://localhost:3001/api/geocode?lat=${this.mapCoordinates.latitude}&lon=${this.mapCoordinates.longitude}`;
    this.http.get<any>(url).subscribe(
      response => {
        console.log('Risposta reverseGeocode:', response);
        if (response && response.address) {
          const address = response.address;
          this.step2.patchValue({
            street: address.road || address.pedestrian || address.street || '',
            city: address.city || address.town || address.village || address.municipality || '',
            postalCode: address.postcode || '',
            state: address.state || address.region || ''
          });
        }
      },
      error => {
        console.error('Errore nella geolocalizzazione inversa:', error);
      }
    );
  }

  private forwardGeocode() {
    const street = this.step2.get('street')?.value || '';
    const city = this.step2.get('city')?.value || '';
    const postalCode = this.step2.get('postalCode')?.value || '';
    const state = this.step2.get('state')?.value || '';
    const query = `${street}, ${city}, ${postalCode}, ${state}`.trim();
    if (!query) return;

    const url = `http://localhost:3001/api/geocode?query=${encodeURIComponent(query)}`;
    this.http.get<any[]>(url).subscribe(
      response => {
        console.log('Risposta forwardGeocode:', response);
        if (response && response.length > 0) {
          const result = response[0];
          this.mapCoordinates.latitude = parseFloat(result.lat);
          this.mapCoordinates.longitude = parseFloat(result.lon);
          this.step2.patchValue({
            latitude: this.mapCoordinates.latitude,
            longitude: this.mapCoordinates.longitude
          });
          this.updateMapView();
          // Aggiorna i campi indirizzo con i dati della risposta
          if (result.address) {
            this.step2.patchValue({
              street: result.address.road || result.address.pedestrian || result.address.street || '',
              city: result.address.city || result.address.town || result.address.village || result.address.municipality || '',
              postalCode: result.address.postcode || '',
              state: result.address.state || result.address.region || ''
            });
          }
        } else {
          console.warn('Nessun risultato trovato per l\'indirizzo:', query);
        }
      },
      error => {
        console.error('Errore nella geolocalizzazione diretta:', error);
      }
    );
  }

  nextStep() {
    if (this.currentStep === 1 && this.step1.invalid) return;
    if (this.currentStep === 2 && this.step2.invalid) return;
    if (this.currentStep === 2) {
      if (this.map) {
        this.map.remove();
        this.map = undefined;
      }
      if (this.marker) {
        this.marker.remove();
      }
    }
    this.currentStep++;
    if (this.currentStep === 2) {
      setTimeout(() => this.initializeMap(), 0);
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      if (this.currentStep === 2 && this.map) {
        this.map.remove();
        this.map = undefined;
      }
      if (this.currentStep === 2 && this.marker) {
        this.marker.remove();
      }
      this.currentStep--;
      if (this.currentStep === 2) {
        setTimeout(() => this.initializeMap(), 0);
      }
    }
  }

  onSubmit() {
    if (this.signupForm.invalid) return;

    const formData = {
      email: this.step1.get('email')?.value,
      password: this.step1.get('password')?.value,
      phone: this.step3.get('phone')?.value,
      description: this.step3.get('description')?.value,
      vatNumber: this.step3.get('vatNumber')?.value,
      website: this.step3.get('website')?.value,
      street: this.step2.get('street')?.value,
      city: this.step2.get('city')?.value,
      postalCode: this.step2.get('postalCode')?.value,
      state: this.step2.get('state')?.value,
      unitDetail: this.step2.get('unitDetail')?.value,
      longitude: this.step2.get('longitude')?.value,
      latitude: this.step2.get('latitude')?.value
    };

    this.restService.registerAgency(formData).subscribe({
      next: (response) => {
        console.log('Registrazione agenzia completata:', response);
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Errore registrazione agenzia:', error);
      }
    });
  }

  get step1() { return this.signupForm.get('step1') as FormGroup; }
  get step2() { return this.signupForm.get('step2') as FormGroup; }
  get step3() { return this.signupForm.get('step3') as FormGroup; }
}