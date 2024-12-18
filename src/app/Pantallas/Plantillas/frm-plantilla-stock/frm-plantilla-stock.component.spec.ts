import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrmPlantillaStockComponent } from './frm-plantilla-stock.component';

describe('FrmPlantillaStockComponent', () => {
  let component: FrmPlantillaStockComponent;
  let fixture: ComponentFixture<FrmPlantillaStockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrmPlantillaStockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrmPlantillaStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
