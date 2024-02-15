import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrmAyudaPantallaComponent } from './frm-ayuda-pantalla.component';

describe('FrmAyudaPantallaComponent', () => {
  let component: FrmAyudaPantallaComponent;
  let fixture: ComponentFixture<FrmAyudaPantallaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrmAyudaPantallaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrmAyudaPantallaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
