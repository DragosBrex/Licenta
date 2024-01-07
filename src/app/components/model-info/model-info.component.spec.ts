import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelInfoComponent } from './model-info.component';

describe('ModelInfoComponent', () => {
  let component: ModelInfoComponent;
  let fixture: ComponentFixture<ModelInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModelInfoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModelInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
