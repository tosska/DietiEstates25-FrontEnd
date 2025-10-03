import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OffersByListingComponent } from './offers-by-listing.component';

describe('OffersByListingComponent', () => {
  let component: OffersByListingComponent;
  let fixture: ComponentFixture<OffersByListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OffersByListingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OffersByListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
