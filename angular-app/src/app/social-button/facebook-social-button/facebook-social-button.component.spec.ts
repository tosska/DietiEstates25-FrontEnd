import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacebookSocialButtonComponent } from './facebook-social-button.component';

describe('FacebookSocialButtonComponent', () => {
  let component: FacebookSocialButtonComponent;
  let fixture: ComponentFixture<FacebookSocialButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FacebookSocialButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FacebookSocialButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
