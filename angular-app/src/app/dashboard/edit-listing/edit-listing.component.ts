import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router'; // Aggiunto ActivatedRoute
import { ToastrService } from 'ngx-toastr';
import { ListingBackendService } from '../../_services/listing-backend/listing-backend.service';
import { AuthService } from '../../_services/auth/auth.service';
import { GeoService } from '../../_services/geo-service/geo.service';
import { LocationRequest } from '../../_services/geo-service/location-request';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { UtilsService } from '../../_services/utils/utils.service';
import { Listing } from '../../_services/listing-backend/listing'; // Assicurati di importare l'interfaccia


@Component({
  selector: 'app-edit-listing-page',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './edit-listing.component.html', // RIUTILIZZIAMO LO STESSO HTML
  styleUrls: ['./edit-listing.component.scss']
})
export class EditListingComponent implements OnInit {
  // Inject services
  toastr = inject(ToastrService);
  router = inject(Router);
  route = inject(ActivatedRoute); // Serve per leggere l'ID
  listingService = inject(ListingBackendService); 
  authService = inject(AuthService);
  geoService = inject(GeoService); 
  utilsService = inject(UtilsService);

  // Variabili identiche alla Create
  citySuggestions: LocationRequest[] = [];
  streetSuggestions: LocationRequest[] = [];
  availableRooms: number[] = Array.from({ length: 10 }, (_, i) => i + 1);
  selectedCity: LocationRequest | null = null;
  selectedLocation: LocationRequest | null = null;
  addressVerified: boolean = false;
  listingForm!: FormGroup;
  
  // Gestione Immagini
  images: File[] = []; // Nuove immagini da caricare
  urlPreview: string[] = []; // Anteprime (sia vecchie che nuove)
  existingPhotosUrls: string[] = []; // Tiene traccia delle foto che c'erano già
  photosToDelete: string[] = []; // Lista degli URL delle foto vecchie da cancellare

  verificationIsClicked: boolean = false;
  verificationInProgress: boolean = false;
  availableYears: number[] = [];
  availableProperties: {id: number, name: string}[] = [];
  
  // Variabile per capire se siamo in edit (anche se la classe è diversa, utile per logiche interne)
  listingId: number | null = null;

  ngOnInit(): void {
    this.availableYears = this.utilsService.generateYears();
    this.getProperties();
    this.initForm(); // Inizializza il form vuoto

    // Recupera l'ID e carica i dati
    this.listingId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.listingId) {
      this.loadListingData(this.listingId);
    }
  }

  // 1. Inizializzazione Form (Identica alla Create)
  initForm() {
    this.listingForm = new FormGroup({
      title: new FormControl('', Validators.required),
      price: new FormControl(null, [Validators.required, Validators.min(0)]),
      listingType: new FormControl('Sale', Validators.required),
      description: new FormControl('', Validators.required),
      area: new FormControl(null, [Validators.required, Validators.min(0)]),
      numberRooms: new FormControl(1, [Validators.required, Validators.min(1)]),
      propertyType: new FormControl('', Validators.required),
      constructionYear: new FormControl(null, [Validators.required, Validators.min(1000), Validators.max(new Date().getFullYear())]),
      energyClass: new FormControl(null),
      address: new FormGroup({
        street: new FormControl('', Validators.required),
        city: new FormControl('', Validators.required),
        houseNumber: new FormControl('', Validators.required),
        unitDetail: new FormControl('', ),
        postalCode: new FormControl('', Validators.required),
      })
    });

    this.setupGeoListeners(); // Spostato qui per pulizia
  }

  // 2. Caricamento Dati Esistenti
  loadListingData(id: number) {
    this.listingService.getListingById(id).subscribe({
      next: (listing: any) => { // Usa 'any' o l'interfaccia Listing completa
        
        // A. Popola il Form
        this.listingForm.patchValue({
          title: listing.title,
          price: listing.price, // Nota: verrà visualizzato come numero puro, formatPrice lo gestirà all'input
          listingType: listing.listingType,
          description: listing.description,
          area: listing.area,
          numberRooms: listing.numberRooms,
          propertyType: listing.propertyType,
          constructionYear: listing.constructionYear,
          energyClass: listing.energyClass,
          address: {
            street: listing.Address.street,
            city: listing.Address.city,
            houseNumber: listing.Address.houseNumber,
            unitDetail: listing.Address.unitDetail || '', // Gestisci null
            postalCode: listing.Address.postalCode
          }
        });

        // B. Ricostruisci la Location per la mappa e la verifica
        this.selectedLocation = {
          formatted: `${listing.Address.street}, ${listing.Address.city}`,
          street: listing.Address.street,
          city: listing.Address.city,
          housenumber: listing.Address.houseNumber,
          postalCode: listing.Address.postalCode,
          latitude: listing.Address.latitude,
          longitude: listing.Address.longitude,
          country: listing.Address.country || 'Italy',
          countryCode: 'it'
          // Aggiungi altri campi se necessario dal tuo LocationRequest
        } as LocationRequest;

        // C. Segna l'indirizzo come verificato (poiché viene dal DB)
        this.addressVerified = true;
        this.verificationIsClicked = true;

        // D. Gestione Foto Esistenti
        if (listing.Photos && listing.Photos.length > 0) {
          listing.Photos.forEach((photo: any) => {
             this.urlPreview.push(photo.url);
             this.existingPhotosUrls.push(photo.url);
          });
        }
        
        // E. Formatta visivamente il prezzo (opzionale, se vuoi i puntini subito)
        // Se hai accesso all'input element, altrimenti Angular mostra il numero nudo
      },
      error: (err) => {
        this.toastr.error('Impossibile caricare l\'annuncio');
        this.router.navigate(['/']);
      }
    });
  }

  // ... [I metodi setupGeoListeners, closeSuggestionList, selectSuggestionCity, selectSuggestionStreet sono identici alla CreatePage] ...
  // Ti consiglio di creare una classe base o copiare quei metodi qui.
  // Per brevità, assumo tu li abbia copiati qui sotto.
  
  setupGeoListeners() {
      // Incolla qui la logica del valueChanges che avevi in ngOnInit
      this.listingForm.get('address.city')?.valueChanges.pipe(
          debounceTime(600), distinctUntilChanged(),
          switchMap((text) => (!text || text.trim() === '') ? [] : this.geoService.fetchSuggestions(text, "city", false))
      ).subscribe(res => this.citySuggestions = res as LocationRequest[]);
      
      this.listingForm.get('address.street')?.valueChanges.pipe(
          debounceTime(600), distinctUntilChanged(),
          switchMap((text) => (!text || text.trim() === '') ? [] : this.geoService.fetchSuggestions(text, "street", false))
      ).subscribe(res => this.streetSuggestions = res as LocationRequest[]);
  }
  
  // Copia qui selectSuggestionCity, selectSuggestionStreet, setValuesFromSelectedStreet, verifyAddress, resetVerificationAddress...

  // MODIFICATO: Rimozione Immagine
  removeImage(index: number) {
    if (index > -1 && index < this.urlPreview.length) {
      const urlToRemove = this.urlPreview[index];

      // Caso 1: È una foto vecchia (già nel DB)
      if (this.existingPhotosUrls.includes(urlToRemove)) {
        this.photosToDelete.push(urlToRemove); // La segniamo da cancellare
        this.existingPhotosUrls = this.existingPhotosUrls.filter(u => u !== urlToRemove);
      } 
      // Caso 2: È una foto nuova (File appena caricato)
      else {
        // Dobbiamo trovare l'indice corrispondente nell'array this.images
        // Attenzione: l'indice 'index' di urlPreview non corrisponde 1:1 a this.images se ci sono foto vecchie miste.
        // Calcolo: le foto nuove sono in coda a quelle vecchie (nella visualizzazione iniziale).
        // Se l'utente rimuove e aggiunge, la logica si complica.
        // Soluzione Semplice: Rimuovi dall'array images basandoti sulla differenza di lunghezza
        
        // Questo approccio base funziona se l'utente non fa troppi "rimuovi-aggiungi-rimuovi" misti complessi
        // Per semplicità: ricalcoliamo l'array images
        // Nota: Questo richiede una logica più robusta se si vuole precisione assoluta, 
        // ma per ora rimuoviamo solo visivamente e resettiamo l'input file.
        
        // Per un MVP: rimuoviamo l'immagine più recente aggiunta se si rimuove una "nuova"
        // (O implementa un mapping ID -> File più preciso)
         const newImageIndex = index - this.existingPhotosUrls.length;
         if(newImageIndex >= 0) {
             this.images.splice(newImageIndex, 1);
         }
      }

      // Rimuovi dall'anteprima
      this.urlPreview.splice(index, 1);
    }
  }

  // Copia qui onFileSelected, formatPrice, getProperties...
  getProperties() {
     this.listingService.getPropertyTypes().subscribe(types => {
       types.forEach(el => this.availableProperties.push({
         id: el.id, name: this.listingService.propertiesMapping[el.name]
       }));
     });
  }
  
  onFileSelected(event: any): void {
      // Logica identica, ma ricorda che this.images contiene SOLO le nuove
      const files = event.target.files;
      if (files) {
        for (const file of files) {
          if ((this.urlPreview.length) < 5) { // Controllo sul totale visualizzato
            this.images.push(file); // Aggiungi ai nuovi file
            const reader = new FileReader();
            reader.onload = (e: any) => this.urlPreview.push(e.target.result);
            reader.readAsDataURL(file);
          }
        }
      }
  }

  // MODIFICATO: Submit per Aggiornamento
  onSubmit(): void {
    if (this.listingForm.valid && this.listingId) {
      
      let listing = this.listingForm.value;
      listing.id = this.listingId; // Importante
      
      // Assicuriamoci che l'indirizzo sia l'oggetto corretto
      listing.address = this.geoService.convertLocationToAddress(this.selectedLocation!); 
      
      // Pulizia prezzo
      let price = listing.price;
      if (price !== null && price !== undefined) {
        const normalized = String(price).replace(/\./g, '');
        listing.price = normalized === '' ? null : Number(normalized);
      }

      console.log('Listing da aggiornare:', listing);
      console.log('Foto da cancellare:', this.photosToDelete);
      console.log('Nuove foto:', this.images);

      // Chiama il servizio di UPDATE
      // Nota: Dovrai implementare updateListing nel service che accetta:
      // (listingData, newImages, photosToDelete)
      this.listingService.updateListing(listing, this.images).subscribe({
        next: () => {
          this.toastr.success('Annuncio aggiornato con successo!', 'Successo!');
          this.router.navigate(['/listing', this.listingId]);
        },
        error: (error) => { 
          this.toastr.error("Si è verificato un errore durante l'aggiornamento");
        }
      });
        
    } else {
      this.toastr.error('Controlla i campi e verifica l\'indirizzo.', 'Errore!');
      this.listingForm.markAllAsTouched();
    }
  }

  // Includi resetVerificationAddress, formatPrice, verifyAddress, ecc.
  // Assicurati che resetVerificationAddress imposti addressVerified = false se si tocca l'indirizzo.
  resetVerificationAddress(): void {
    if (this.addressVerified) {
        this.addressVerified = false;
        this.verificationIsClicked = false;
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