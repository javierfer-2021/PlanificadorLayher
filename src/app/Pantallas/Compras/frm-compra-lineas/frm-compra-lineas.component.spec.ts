import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrmCompraLineasComponent } from './frm-compra-lineas.component';

describe('FrmCompraLineasComponent', () => {
  let component: FrmCompraLineasComponent;
  let fixture: ComponentFixture<FrmCompraLineasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrmCompraLineasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrmCompraLineasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
