import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListingTrackingComponent } from './listing-tracking.component';

describe('ListingTrackingComponent', () => {
  let component: ListingTrackingComponent;
  let fixture: ComponentFixture<ListingTrackingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListingTrackingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListingTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
