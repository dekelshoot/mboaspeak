import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RessourceMenteeComponent } from './ressource-mentee.component';

describe('RessourceMenteeComponent', () => {
  let component: RessourceMenteeComponent;
  let fixture: ComponentFixture<RessourceMenteeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RessourceMenteeComponent]
    });
    fixture = TestBed.createComponent(RessourceMenteeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
