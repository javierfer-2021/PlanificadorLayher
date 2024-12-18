import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrmPlantillaStockBuscarComponent } from './frm-plantilla-stock-buscar.component';

describe('FrmPlantillaStockBuscarComponent', () => {
  let component: FrmPlantillaStockBuscarComponent;
  let fixture: ComponentFixture<FrmPlantillaStockBuscarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrmPlantillaStockBuscarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrmPlantillaStockBuscarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
