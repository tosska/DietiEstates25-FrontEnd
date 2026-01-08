import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoogleSocialButtonComponent } from './google-social-button.component';

describe('GoogleSocialButtonComponent', () => {
  let component: GoogleSocialButtonComponent;
  let fixture: ComponentFixture<GoogleSocialButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoogleSocialButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoogleSocialButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
