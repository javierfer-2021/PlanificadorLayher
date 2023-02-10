import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrmCompraBuscarComponent } from './frm-compra-buscar.component';

describe('FrmCompraBuscarComponent', () => {
  let component: FrmCompraBuscarComponent;
  let fixture: ComponentFixture<FrmCompraBuscarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrmCompraBuscarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrmCompraBuscarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
