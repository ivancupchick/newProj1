import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipmentModuleComponent } from './equipment-module.component';

describe('EquipmentModuleComponent', () => {
  let component: EquipmentModuleComponent;
  let fixture: ComponentFixture<EquipmentModuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EquipmentModuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EquipmentModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
