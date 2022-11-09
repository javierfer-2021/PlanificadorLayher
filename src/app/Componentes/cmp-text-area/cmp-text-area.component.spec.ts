import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmpTextAreaComponent } from './cmp-text-area.component';

describe('CmpTextAreaComponent', () => {
  let component: CmpTextAreaComponent;
  let fixture: ComponentFixture<CmpTextAreaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmpTextAreaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmpTextAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
