import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanceCalculatorComponent } from './finance-calculator.component';

describe('FinanceCalculatorComponent', () => {
  let component: FinanceCalculatorComponent;
  let fixture: ComponentFixture<FinanceCalculatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinanceCalculatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinanceCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
