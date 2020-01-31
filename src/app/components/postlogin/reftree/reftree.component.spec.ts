import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReftreeComponent } from './reftree.component';

describe('ReftreeComponent', () => {
  let component: ReftreeComponent;
  let fixture: ComponentFixture<ReftreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReftreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReftreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
