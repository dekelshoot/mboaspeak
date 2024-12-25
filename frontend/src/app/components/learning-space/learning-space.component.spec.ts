import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LearningSpaceComponent } from './learning-space.component';

describe('LearningSpaceComponent', () => {
  let component: LearningSpaceComponent;
  let fixture: ComponentFixture<LearningSpaceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LearningSpaceComponent]
    });
    fixture = TestBed.createComponent(LearningSpaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
