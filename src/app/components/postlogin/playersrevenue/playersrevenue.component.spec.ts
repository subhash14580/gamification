import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayersrevenueComponent } from './playersrevenue.component';

describe('PlayersrevenueComponent', () => {
  let component: PlayersrevenueComponent;
  let fixture: ComponentFixture<PlayersrevenueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayersrevenueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayersrevenueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
