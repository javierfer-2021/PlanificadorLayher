import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrmOfertaBuscarComponent } from './frm-oferta-buscar.component';

describe('FrmOfertaBuscarComponent', () => {
  let component: FrmOfertaBuscarComponent;
  let fixture: ComponentFixture<FrmOfertaBuscarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrmOfertaBuscarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrmOfertaBuscarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
