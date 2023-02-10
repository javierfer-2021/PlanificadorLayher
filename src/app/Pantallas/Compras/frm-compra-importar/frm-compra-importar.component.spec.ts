import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrmCompraImportarComponent } from './frm-compra-importar.component';

describe('FrmCompraImportarComponent', () => {
  let component: FrmCompraImportarComponent;
  let fixture: ComponentFixture<FrmCompraImportarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrmCompraImportarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrmCompraImportarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
