import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkbalanceComponent } from './networkbalance.component';

describe('NetworkbalanceComponent', () => {
  let component: NetworkbalanceComponent;
  let fixture: ComponentFixture<NetworkbalanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetworkbalanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkbalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
