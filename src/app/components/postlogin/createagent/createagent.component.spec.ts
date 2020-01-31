import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateagentComponent } from './createagent.component';

describe('CreateagentComponent', () => {
  let component: CreateagentComponent;
  let fixture: ComponentFixture<CreateagentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateagentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateagentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
