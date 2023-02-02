import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrmOfertaImportarComponent } from './frm-oferta-importar.component';

describe('FrmOfertaImportarComponent', () => {
  let component: FrmOfertaImportarComponent;
  let fixture: ComponentFixture<FrmOfertaImportarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrmOfertaImportarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrmOfertaImportarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
