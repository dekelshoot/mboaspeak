import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluationMenteeComponent } from './evaluation-mentee.component';

describe('EvaluationMenteeComponent', () => {
  let component: EvaluationMenteeComponent;
  let fixture: ComponentFixture<EvaluationMenteeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EvaluationMenteeComponent]
    });
    fixture = TestBed.createComponent(EvaluationMenteeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
