import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanceConditionsComponent } from './finance-conditions.component';

describe('FinanceConditionsComponent', () => {
  let component: FinanceConditionsComponent;
  let fixture: ComponentFixture<FinanceConditionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinanceConditionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinanceConditionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
