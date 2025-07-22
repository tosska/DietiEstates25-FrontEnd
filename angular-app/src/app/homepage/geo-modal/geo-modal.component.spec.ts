import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeoModalComponent } from './geo-modal.component';

describe('GeoModalComponent', () => {
  let component: GeoModalComponent;
  let fixture: ComponentFixture<GeoModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeoModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
