import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSessionMentorComponent } from './add-session-mentor.component';

describe('AddSessionMentorComponent', () => {
  let component: AddSessionMentorComponent;
  let fixture: ComponentFixture<AddSessionMentorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddSessionMentorComponent]
    });
    fixture = TestBed.createComponent(AddSessionMentorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
