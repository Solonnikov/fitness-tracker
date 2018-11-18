import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PastTraningsComponent } from './past-tranings.component';

describe('PastTraningsComponent', () => {
  let component: PastTraningsComponent;
  let fixture: ComponentFixture<PastTraningsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PastTraningsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PastTraningsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
