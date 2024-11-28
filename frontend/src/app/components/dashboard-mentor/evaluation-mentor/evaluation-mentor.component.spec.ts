import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluationMentorComponent } from './evaluation-mentor.component';

describe('EvaluationMentorComponent', () => {
  let component: EvaluationMentorComponent;
  let fixture: ComponentFixture<EvaluationMentorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EvaluationMentorComponent]
    });
    fixture = TestBed.createComponent(EvaluationMentorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
