import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotpwsdComponent } from './forgotpwsd.component';

describe('ForgotpwsdComponent', () => {
  let component: ForgotpwsdComponent;
  let fixture: ComponentFixture<ForgotpwsdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForgotpwsdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotpwsdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
