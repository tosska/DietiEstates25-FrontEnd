import { Component } from '@angular/core';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { filter } from 'rxjs';
import { FilterModalComponent } from './filter-modal/filter-modal.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [SearchBarComponent, CommonModule],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss'
})
export class HomepageComponent {

}
