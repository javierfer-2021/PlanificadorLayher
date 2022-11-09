import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmpMatModalDialogComponent } from './cmp-mat-modal-dialog.component';

describe('CmpMatModalDialogComponent', () => {
  let component: CmpMatModalDialogComponent;
  let fixture: ComponentFixture<CmpMatModalDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmpMatModalDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmpMatModalDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
