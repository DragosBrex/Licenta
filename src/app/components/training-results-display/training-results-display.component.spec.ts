import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingResultsDisplayComponent } from './training-results-display.component';

describe('TrainingResultsDisplayComponent', () => {
  let component: TrainingResultsDisplayComponent;
  let fixture: ComponentFixture<TrainingResultsDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrainingResultsDisplayComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TrainingResultsDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
