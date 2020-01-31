import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkcodesComponent } from './linkcodes.component';

describe('LinkcodesComponent', () => {
  let component: LinkcodesComponent;
  let fixture: ComponentFixture<LinkcodesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkcodesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkcodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
