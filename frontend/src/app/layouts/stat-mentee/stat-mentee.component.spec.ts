import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatMenteeComponent } from './stat-mentee.component';

describe('StatMenteeComponent', () => {
  let component: StatMenteeComponent;
  let fixture: ComponentFixture<StatMenteeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StatMenteeComponent]
    });
    fixture = TestBed.createComponent(StatMenteeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
