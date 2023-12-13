import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelPredictComponent } from './model-predict.component';

describe('ModelPredictComponent', () => {
  let component: ModelPredictComponent;
  let fixture: ComponentFixture<ModelPredictComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModelPredictComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModelPredictComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
