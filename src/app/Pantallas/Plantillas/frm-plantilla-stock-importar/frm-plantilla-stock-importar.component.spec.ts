import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrmPlantillaStockImportarComponent } from './frm-plantilla-stock-importar.component';

describe('FrmPlantillaStockImportarComponent', () => {
  let component: FrmPlantillaStockImportarComponent;
  let fixture: ComponentFixture<FrmPlantillaStockImportarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrmPlantillaStockImportarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrmPlantillaStockImportarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
