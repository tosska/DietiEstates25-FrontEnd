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
  newImages: File[] = [];
  urlPreview: string[] = []; // Anteprime (sia vecchie che nuove)
  existingPhotosUrls: string[] = []; // Tiene traccia delle foto che c'erano già
  photosToDelete: string[] = []; // Lista degli URL delle foto vecchie da cancellare

  verificationIsClicked: boolean = false;
  verificationInProgress: boolean = false;
  availableYears: number[] = [];
  availableProperties: { id: number, name: string }[] = [];

  // Variabile per capire se siamo in edit (anche se la classe è diversa, utile per logiche interne)
  listingId: number | null = null;

  listingToEdit: Listing | null = null;

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
      propertyTypeId: new FormControl('', Validators.required),
      constructionYear: new FormControl(null, [Validators.required, Validators.min(1000), Validators.max(new Date().getFullYear())]),
      energyClass: new FormControl(null),
      address: new FormGroup({
        street: new FormControl('', Validators.required),
        city: new FormControl('', Validators.required),
        houseNumber: new FormControl('', Validators.required),
        unitDetail: new FormControl('',),
        postalCode: new FormControl('', Validators.required),
      })
    });

    this.setupGeoListeners(); // Spostato qui per pulizia
  }

  // 2. Caricamento Dati Esistenti
  loadListingData(id: number) {
    this.listingService.getListingById(id).subscribe({
      next: (listing: any) => { // Usa 'any' o l'interfaccia Listing completa

        this.listingToEdit = listing;

        // A. Popola il Form
        this.listingForm.patchValue({
          title: listing.title,
          listingType: listing.listingType,
          description: listing.description,
          area: listing.area,
          numberRooms: listing.numberRooms,
          propertyTypeId: listing.propertyType.id,
          constructionYear: listing.constructionYear,
          energyClass: listing.energyClass,
          address: {
            street: listing.Address.street,
            city: listing.Address.city,
            houseNumber: listing.Address.houseNumber,
            unitDetail: listing.Address.unitDetail || '', // Gestisci null
            postalCode: listing.Address.postalCode
          }
        }, { emitEvent: false });

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
            this.urlPreview.push(this.listingService.craftListingImageUrl(photo.url));
            this.existingPhotosUrls.push(this.listingService.craftListingImageUrl(photo.url));
          });
        }

        // E. Formatta visivamente il prezzo (opzionale, se vuoi i puntini subito)
        this.listingForm!.get("price")!.setValue(this.utilsService.formatNumber(this.listingToEdit!.price.toString()));

      },
      error: (err) => {
        this.toastr.error('Impossibile caricare l\'annuncio');
        this.router.navigate(['/']);
      }
    });

    //Prima formattazione del prezzo
    
  }

  async urlToFile(photoUrl: string, index: number) : Promise<File> {
    const res = await fetch(photoUrl);
    const blob = await res.blob();

    const mimeType = blob.type; // es: "image/jpeg"
    const extension = mimeType.split('/')[1]; // "jpeg"
    const filename = `old_photo_${index}.${extension}`;

    const loadedImage = new File(
      [blob],
      filename,
      { type: mimeType }
    );

    return loadedImage;
  }

async loadImages() {
    try {
      // 1. Converti tutte le URL in Promesse di File
      const filePromises = this.existingPhotosUrls.map((url, index) => 
          this.urlToFile(url, index)
      );

      // 2. Aspetta che TUTTE siano scaricate e convertite (mantiene l'ordine!)
      const oldFiles = await Promise.all(filePromises);

      // 3. Unisci Vecchie + Nuove
      // Nota: this.newImages sono quelle caricate ora dall'utente (già File)
      this.images = [...oldFiles, ...this.newImages];

      console.log('Immagini pronte per l\'invio:', this.images);

    } catch (error) {
      console.error("Errore nel scaricare le vecchie immagini:", error);
      // Gestisci l'errore (es. mostra un toast all'utente)
    }
  }



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
      const itemToRemove = this.urlPreview[index];
      // 2. Verifichiamo se è una foto VECCHIA (cioè se l'URL è presente nella lista delle vecchie)
      const existingIndex = this.existingPhotosUrls.indexOf(itemToRemove);
      if(existingIndex !==-1) 
        this.existingPhotosUrls.splice(existingIndex, 1);
      else {
        const relativeIndex = index - this.existingPhotosUrls.length;
        if (relativeIndex >= 0 && relativeIndex < this.newImages.length) {
           this.newImages.splice(relativeIndex, 1);
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
          this.newImages.push(file); // Aggiungi ai nuovi file
          const reader = new FileReader();
          reader.onload = (e: any) => this.urlPreview.push(e.target.result);
          reader.readAsDataURL(file);
        }
      }
    }
  }

  // MODIFICATO: Submit per Aggiornamento
  async onSubmit(): Promise<void> {
    if (this.listingForm.valid && this.listingId) {

      let listing = this.listingForm.value;
      listing.id = this.listingId; // Importante

      // Assicuriamoci che l'indirizzo sia l'oggetto corretto
      listing.address = this.geoService.convertLocationToAddress(this.selectedLocation!);
      console.log("TIPOLOGIA SELEZIONATA:", listing.propertyTypeId);
      
      // Pulizia prezzo
      let price = listing.price;
      if (price !== null && price !== undefined) {
        const normalized = String(price).replace(/\./g, '');
        listing.price = normalized === '' ? null : Number(normalized);
      }

      await this.loadImages();

      this.listingService.updateListing(listing.id, listing, this.images).subscribe({
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
    if (this.selectedLocation) {
      this.verificationIsClicked = true;

      let houseNumber = this.listingForm.get('address')?.get('houseNumber')?.value;
      this.selectedLocation.housenumber = houseNumber;
      console.log('Verifica strada:', this.selectedLocation?.street!);
      console.log('Verifica postal:', this.selectedLocation?.postalCode!);

      if (this.selectedCity) {
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
          if (error.status == 400) {
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
    if (this.selectedLocation) {

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