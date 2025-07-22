import { Component, EventEmitter, Output } from '@angular/core';
import { GeoMapComponent } from '../../geo-map/geo-map.component';

@Component({
  selector: 'app-geo-modal',
  standalone: true,
  imports: [GeoMapComponent],
  templateUrl: './geo-modal.component.html',
  styleUrl: './geo-modal.component.scss'
})
export class GeoModalComponent {

  @Output() close = new EventEmitter<void>();
  
  onClose() {
    this.close.emit();
  }

}
