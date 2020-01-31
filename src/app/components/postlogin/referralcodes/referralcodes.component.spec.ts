import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferralcodesComponent } from './referralcodes.component';

describe('ReferralcodesComponent', () => {
  let component: ReferralcodesComponent;
  let fixture: ComponentFixture<ReferralcodesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferralcodesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferralcodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
