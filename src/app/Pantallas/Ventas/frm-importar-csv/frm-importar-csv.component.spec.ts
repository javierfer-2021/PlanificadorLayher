import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrmImportarCsvComponent } from './frm-importar-csv.component';

describe('FrmImportarCsvComponent', () => {
  let component: FrmImportarCsvComponent;
  let fixture: ComponentFixture<FrmImportarCsvComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrmImportarCsvComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrmImportarCsvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
