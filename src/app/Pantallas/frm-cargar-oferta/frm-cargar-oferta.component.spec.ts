import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrmCargarOfertaComponent } from './frm-cargar-oferta.component';

describe('FrmCargarOfertaComponent', () => {
  let component: FrmCargarOfertaComponent;
  let fixture: ComponentFixture<FrmCargarOfertaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrmCargarOfertaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrmCargarOfertaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
