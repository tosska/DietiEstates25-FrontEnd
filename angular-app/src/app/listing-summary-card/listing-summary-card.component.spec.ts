import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListingSummaryCardComponent } from './listing-summary-card.component';

describe('ListingSummaryCardComponent', () => {
  let component: ListingSummaryCardComponent;
  let fixture: ComponentFixture<ListingSummaryCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListingSummaryCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListingSummaryCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
