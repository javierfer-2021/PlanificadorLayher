import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrmUsuarioBuscarComponent } from './frm-usuario-buscar.component';

describe('FrmUsuarioBuscarComponent', () => {
  let component: FrmUsuarioBuscarComponent;
  let fixture: ComponentFixture<FrmUsuarioBuscarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrmUsuarioBuscarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrmUsuarioBuscarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
