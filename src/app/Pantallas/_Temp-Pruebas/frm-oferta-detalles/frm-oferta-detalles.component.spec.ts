import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrmOfertaDetallesComponent } from './frm-oferta-detalles.component';

describe('FrmOfertaDetallesComponent', () => {
  let component: FrmOfertaDetallesComponent;
  let fixture: ComponentFixture<FrmOfertaDetallesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrmOfertaDetallesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrmOfertaDetallesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
