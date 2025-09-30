import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveListingsComponent } from './active-listings.component';

describe('ActiveListingsComponent', () => {
  let component: ActiveListingsComponent;
  let fixture: ComponentFixture<ActiveListingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActiveListingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActiveListingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
