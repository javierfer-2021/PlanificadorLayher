import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrmMostrarCalculoStockComponent } from './frm-mostrar-calculo-stock.component';

describe('FrmMostrarCalculoStockComponent', () => {
  let component: FrmMostrarCalculoStockComponent;
  let fixture: ComponentFixture<FrmMostrarCalculoStockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrmMostrarCalculoStockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrmMostrarCalculoStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
