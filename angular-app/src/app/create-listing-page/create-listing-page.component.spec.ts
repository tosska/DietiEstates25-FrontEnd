import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateListingPageComponent } from './create-listing-page.component';

describe('CreateListingPageComponent', () => {
  let component: CreateListingPageComponent;
  let fixture: ComponentFixture<CreateListingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateListingPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateListingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
