import { Component } from '@angular/core';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { filter } from 'rxjs';
import { FilterModalComponent } from './filter-modal/filter-modal.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [SearchBarComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss'
})
export class HomepageComponent {

}
