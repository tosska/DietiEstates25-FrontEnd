import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ListingBackendService } from '../_services/listing-backend/listing-backend.service';
import { AuthService } from '../_services/auth/auth.service';
import { GeoService } from '../_services/geo-service/geo.service';
import { LocationRequest } from '../_services/geo-service/location-request';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { UtilsService } from '../_services/utils/utils.service';



@Component({
  selector: 'app-create-listing-page',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './create-listing-page.component.html',
  styleUrl: './create-listing-page.component.scss'
})
export class CreateListingPageComponent {
  toastr = inject(ToastrService);
  router = inject(Router);
  listingService = inject(ListingBackendService); 
  authService = inject(AuthService);
  geoService = inject(GeoService); 
  utilsService = inject(UtilsService);

  citySuggestions: LocationRequest[] = [];
  streetSuggestions: LocationRequest[] = [];
  availableRooms: number[] = Array.from({ length: 10 }, (_, i) => i + 1)

  selectedCity: LocationRequest | null = null;
  selectedLocation: LocationRequest | null = null;

  addressVerified: boolean = false;

  listingForm!: FormGroup;

  images: File[] = []; 
  urlPreview: string [] = [];

  verificationIsClicked: boolean = false;
  verificationInProgress: boolean = false;

  availableYears: number[] = [];
  availableProperties: {id: number, formatted: string}[] = [];

  formattedPrice: string = '';

  ngOnInit(): void {
    this.availableYears = this.utilsService.generateYears();
    this.getProperties();
   
    this.listingForm = new FormGroup({
      // Campi di Listing
      title: new FormControl('', Validators.required),
      price: new FormControl(null, [Validators.required, Validators.min(0)]),
      listingType: new FormControl('Sale', Validators.required),
      description: new FormControl('', Validators.required),
      area: new FormControl(null, [Validators.required, Validators.min(0)]),
      numberRooms: new FormControl(1, [Validators.required, Validators.min(1)]),
      propertyTypeId: new FormControl(null, Validators.required),
      constructionYear: new FormControl(null, [Validators.required, Validators.min(1000), Validators.max(new Date().getFullYear())]),
      energyClass: new FormControl(null),
      
      // Campi di Address (gruppo annidato)
      address: new FormGroup({
        street: new FormControl('', Validators.required),
        city: new FormControl('', Validators.required),
        houseNumber: new FormControl('', Validators.required),
        unitDetail: new FormControl('', ),
        postalCode: new FormControl('', Validators.required),
      })
    });


      // Qui aggiungiamo l’ascolto con debounce
    this.listingForm.get('address.city')?.valueChanges
      .pipe(
        debounceTime(600),             // aspetta 400ms dopo che l’utente smette di scrivere
        distinctUntilChanged(),        // chiama solo se il valore è cambiato
        switchMap((textCity: string) => {

          if(!textCity || textCity.trim() === '') {
            this.citySuggestions = [];
            return [];
          }
          return this.geoService.fetchSuggestions(textCity, "city", false) //con switchMap annullo tutte le richieste precedenti ed effettuo solo l'ultima
        })
      )
      .subscribe({
        next: (suggestionsResponse) => {
          this.citySuggestions = suggestionsResponse as LocationRequest[];
          console.log('Suggerimenti città:', this.citySuggestions);
          //this.citySuggestions = Array.from(new Set(tempSug));
        },
        error: (error) => console.error('Errore durante il recupero dei suggerimenti:', error),
      });

    this.listingForm.get('address.street')?.valueChanges
      .pipe(
        debounceTime(600),             // aspetta 400ms dopo che l’utente smette di scrivere
        distinctUntilChanged(),        // chiama solo se il valore è cambiato
        switchMap((textStreet: string) => {
          if(!textStreet || textStreet.trim() === '') {
            this.streetSuggestions = [];
            return [];
          }
          return this.geoService.fetchSuggestions(textStreet, "street", false) //con switchMap annullo tutte le richieste precedenti ed effettuo solo l'ultima
        })
      )
      .subscribe({
        next: (suggestionsResponse) => {
          this.streetSuggestions = suggestionsResponse as LocationRequest[];
          console.log('Suggerimenti strada:', this.streetSuggestions);
          //this.citySuggestions = Array.from(new Set(tempSug));
        },
        error: (error) => console.error('Errore durante il recupero dei suggerimenti:', error),
      });
  }


  closeSuggestionList() {
    console.log('Chiusura lista suggerimenti città');
    this.citySuggestions = [];
    this.streetSuggestions = [];
  }


  selectSuggestionCity(city: LocationRequest) {
    console.log("dadasdasdas", city)
    this.listingForm.get('address')?.get('city')?.setValue(city.formatted, { emitEvent: false });
    this.listingForm.get('address')?.get('postalCode')?.setValue(city.postalCode);
    this.selectedCity = city;
    this.citySuggestions = [];
  }

  selectSuggestionStreet(locationFromStreet: LocationRequest) {

    this.listingForm.get('address')?.get('street')?.setValue(locationFromStreet.street, { emitEvent: false });
    console.log('Strada selezionata:', locationFromStreet);
    this.selectedLocation = locationFromStreet;

    this.setValuesFromSelectedStreet();

    this.streetSuggestions = [];
  }


  setValuesFromSelectedStreet() {
    if(this.selectedLocation) {
    
      this.listingForm.get('address')?.get('city')?.setValue(this.selectedLocation.city, { emitEvent: false });
      this.listingForm.get('address')?.get('postalCode')?.setValue(this.selectedLocation.postalCode);
    }

  }

  verifyAddress() {
    if(this.selectedLocation){
      this.verificationIsClicked = true;

      let houseNumber= this.listingForm.get('address')?.get('houseNumber')?.value;
      this.selectedLocation.housenumber = houseNumber;
      console.log('Verifica strada:',  this.selectedLocation?.street!);
      console.log('Verifica postal:',  this.selectedLocation?.postalCode!);

      if(this.selectedCity){
        this.selectedLocation.city = this.selectedCity.city;
        this.selectedLocation.postalCode = this.selectedCity.postalCode;
      }

      this.verificationInProgress = true;

      this.geoService.verifyAddress(this.selectedLocation).subscribe({
          next: (result) => {
            this.verificationInProgress = false;
            console.log('Risultato verifica indirizzo:', result);
            if (this.selectedLocation && result) {
              
              this.addressVerified = true;
              this.selectedLocation.latitude = result?.latitude
              this.selectedLocation.longitude = result?.longitude
            } else {
              this.addressVerified = false;
            }

          },
          error: (error) => {
            if(error.status== 400) {
            this.verificationInProgress = false;
            this.addressVerified = false;
            }
          }
      });

    }

  }

  removeImage(index: number) {
      if (index > -1 && index < this.urlPreview.length) {
        this.urlPreview.splice(index, 1);
    }
  }


  onFileSelected(event: any): void {
    const files = event.target.files;
    if (files) {
      for (const file of files) {
        // Controlla se il limite massimo di 5 immagini è stato raggiunto
        if (this.images.length < 5) {
          const reader = new FileReader();
          reader.onload = (e: any) => {
            // Aggiungi l'immagine all'array con il file e l'URL di anteprima
            this.images.push(file);
            this.urlPreview.push(e.target.result );
          };
          reader.readAsDataURL(file); // Legge l'immagine come url
        } else {
          // Opzionale: notifica l'utente che il limite è stato raggiunto
          console.warn('Limite massimo di 5 immagini raggiunto.');
  
        }
      }
      // Resetta il valore dell'input per permettere il ricaricamento degli stessi file
      event.target.value = ''; 
    }
  

  }



  onSubmit(): void {
    if (this.listingForm.valid) {
      
      let listing = this.listingForm.value;

      listing.pr
      listing.address = this.geoService.convertLocationToAddress(this.selectedLocation!); 
      let price = listing.price;
      if (price !== null && price !== undefined) {
        const normalized = String(price).replace(/\./g, '');
        listing.price = normalized === '' ? null : Number(normalized);
      } else {
        listing.price = null;
      }

      console.log('Listing da inviare:', listing);
      
      this.listingService.createListing(listing, this.images).subscribe({
        next: (listingId) => {
          this.toastr.success('Annuncio creato con successo!', 'Successo!');
          this.router.navigate(['/listing', listingId]); // Naviga alla pagina delle listings dopo la creazione
        },
        error: (error) => { 
          this.toastr.error("Si è verificato un errore nella creazione dell'annuncio");
        }
      });
        
      
    } else {
      console.log('Il form non è valido. Controlla i campi.');
      this.toastr.error('Compila tutti i campi obbligatori.', 'Errore!');
      this.listingForm.markAllAsTouched(); // Rende tutti i controlli touched per mostrare gli errori
    }
  }

  resetVerificationAddress(): void {
  if (this.addressVerified) {
    console.log('Indirizzo modificato: Verifica resettata');
    this.addressVerified = false;
    this.verificationIsClicked = false; // Fa sparire la scritta 
    
    if (this.selectedLocation) {
      this.selectedLocation.latitude = undefined;
      this.selectedLocation.longitude = undefined;
    }
  }
}


getProperties() {

 
  this.listingService.getPropertyTypes().subscribe({
    next: (types) => {
      
      types.forEach(element => {
        this.availableProperties.push({
          id: element.id,
          formatted: this.listingService.propertiesMapping[element.name]
        });
      });
    },
    error: (error) => {
      console.log(error);
    }
  });

}


formatPrice(event: Event): void {
    const input = (event.target as HTMLInputElement);

    // Rimuovi tutto ciò che non è numero
    const numericValue = input.value.replace(/\D/g, '');

    // Aggiorna FormControl con valore numerico (o null se vuoto)
    this.listingForm.get('price')?.setValue(numericValue ? +numericValue : null);

    // Aggiorna valore formattato per la UI
    input.value = this.utilsService.formatNumber(numericValue);
}



  


}
