import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrmImportarMaestrosComponent } from './frm-importar-maestros.component';

describe('FrmImportarMaestrosComponent', () => {
  let component: FrmImportarMaestrosComponent;
  let fixture: ComponentFixture<FrmImportarMaestrosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrmImportarMaestrosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrmImportarMaestrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
