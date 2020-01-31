import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddrfcComponent } from './addrfc.component';

describe('AddrfcComponent', () => {
  let component: AddrfcComponent;
  let fixture: ComponentFixture<AddrfcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddrfcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddrfcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
