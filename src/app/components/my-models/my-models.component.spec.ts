import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyModelsComponent } from './my-models.component';

describe('MyModelsComponent', () => {
  let component: MyModelsComponent;
  let fixture: ComponentFixture<MyModelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyModelsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MyModelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
