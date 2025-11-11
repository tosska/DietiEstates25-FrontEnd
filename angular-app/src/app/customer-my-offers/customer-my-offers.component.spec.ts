import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerMyOffersComponent } from './customer-my-offers.component';

describe('CustomerMyOffersComponent', () => {
  let component: CustomerMyOffersComponent;
  let fixture: ComponentFixture<CustomerMyOffersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerMyOffersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerMyOffersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
