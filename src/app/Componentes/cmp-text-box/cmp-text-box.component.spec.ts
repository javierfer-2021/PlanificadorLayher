import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmpTextBoxComponent } from './cmp-text-box.component';

describe('CmpTextBoxComponent', () => {
  let component: CmpTextBoxComponent;
  let fixture: ComponentFixture<CmpTextBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmpTextBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmpTextBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
