import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrmPlantillaStockCalcularComponent } from './frm-plantilla-stock-calcular.component';

describe('FrmPlantillaStockCalcularComponent', () => {
  let component: FrmPlantillaStockCalcularComponent;
  let fixture: ComponentFixture<FrmPlantillaStockCalcularComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrmPlantillaStockCalcularComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrmPlantillaStockCalcularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
