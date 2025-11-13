import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerListingTrackingComponent } from './customer-listing-tracking.component';

describe('CustomerListingTrackingComponent', () => {
  let component: CustomerListingTrackingComponent;
  let fixture: ComponentFixture<CustomerListingTrackingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerListingTrackingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerListingTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
