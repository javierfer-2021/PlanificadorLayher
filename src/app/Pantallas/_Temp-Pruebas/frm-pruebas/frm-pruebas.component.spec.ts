import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrmPruebasComponent } from './frm-pruebas.component';

describe('FrmPruebasComponent', () => {
  let component: FrmPruebasComponent;
  let fixture: ComponentFixture<FrmPruebasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrmPruebasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrmPruebasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
