import { Component, EventEmitter, Output } from '@angular/core';
import { GeoMapComponent } from '../../geo-map/geo-map.component';
import { Address } from '../../_services/geo-service/address-request';
import {
  trigger,
  state,
  keyframes, 
  style,
  animate,
  transition,
} from '@angular/animations';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-geo-modal',
  standalone: true,
  imports: [GeoMapComponent, FormsModule],
  templateUrl: './geo-modal.component.html',
  styleUrl: './geo-modal.component.scss',
  animations: [
    trigger('sidebarFlash', [
      transition('* => *', [
        animate(
          '1000ms ease-out',
          keyframes([
            style({ backgroundColor: '#c6f6d5', offset: 0 }), // verde chiaro (inizio)
            style({ backgroundColor: '#c6f6d5', offset: 0.2 }),
            style({ backgroundColor: 'transparent', offset: 1 }), // torna normale
          ])
        ),
      ]),
    ]),
  ],
})
export class GeoModalComponent {

  @Output() close = new EventEmitter<void>();
  @Output() confirmLocationEvent = new EventEmitter<Address>();
  selectedLocationFromMap: Address | null = null;
  selectedRadius: number=1;
  
  onClose() {
    this.close.emit();
  }

  setLocation(location: Address) {
    this.selectedLocationFromMap = location;
    this.selectedLocationFromMap.radiusKm=this.selectedRadius
  }

  onRadiusChange() {

    if(this.selectedLocationFromMap)
      this.selectedLocationFromMap.radiusKm = this.selectedRadius;


  }

  onConfirmLocation(){
    //mi servono solo latitudine e longitudine. Le informazioni sulla località sono solo per il feedback all'utente
    if(this.selectedLocationFromMap) {
      const location: Address = this.selectedLocationFromMap;

      this.confirmLocationEvent.emit({
        formatted: location.formatted,
        latitude: location?.latitude, 
        longitude: location?.longitude, 
        radiusKm: location?.radiusKm});
      this.close.emit();
    }

  }

}
