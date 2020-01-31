import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RevenuefromagentsComponent } from './revenuefromagents.component';

describe('RevenuefromagentsComponent', () => {
  let component: RevenuefromagentsComponent;
  let fixture: ComponentFixture<RevenuefromagentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RevenuefromagentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RevenuefromagentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
