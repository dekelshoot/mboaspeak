import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionMentorComponent } from './session-mentor.component';

describe('SessionMentorComponent', () => {
  let component: SessionMentorComponent;
  let fixture: ComponentFixture<SessionMentorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SessionMentorComponent]
    });
    fixture = TestBed.createComponent(SessionMentorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
