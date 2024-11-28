import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionMenteeComponent } from './session-mentee.component';

describe('SessionMenteeComponent', () => {
  let component: SessionMenteeComponent;
  let fixture: ComponentFixture<SessionMenteeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SessionMenteeComponent]
    });
    fixture = TestBed.createComponent(SessionMenteeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
