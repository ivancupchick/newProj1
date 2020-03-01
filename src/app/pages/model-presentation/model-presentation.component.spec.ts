import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelPresentationComponent } from './model-presentation.component';

describe('ModelPresentationComponent', () => {
  let component: ModelPresentationComponent;
  let fixture: ComponentFixture<ModelPresentationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelPresentationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelPresentationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
