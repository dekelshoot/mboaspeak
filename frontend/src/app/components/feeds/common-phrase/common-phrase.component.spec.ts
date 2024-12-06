import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonPhraseComponent } from './common-phrase.component';

describe('CommonPhraseComponent', () => {
  let component: CommonPhraseComponent;
  let fixture: ComponentFixture<CommonPhraseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CommonPhraseComponent]
    });
    fixture = TestBed.createComponent(CommonPhraseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
