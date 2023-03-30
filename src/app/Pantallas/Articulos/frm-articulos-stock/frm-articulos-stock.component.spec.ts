import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrmArticulosStockComponent } from './frm-articulos-stock.component';

describe('FrmArticulosStockComponent', () => {
  let component: FrmArticulosStockComponent;
  let fixture: ComponentFixture<FrmArticulosStockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrmArticulosStockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrmArticulosStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
