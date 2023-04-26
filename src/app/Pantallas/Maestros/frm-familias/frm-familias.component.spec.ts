import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrmFamiliasComponent } from './frm-familias.component';

describe('FrmFamiliasComponent', () => {
  let component: FrmFamiliasComponent;
  let fixture: ComponentFixture<FrmFamiliasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrmFamiliasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrmFamiliasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
