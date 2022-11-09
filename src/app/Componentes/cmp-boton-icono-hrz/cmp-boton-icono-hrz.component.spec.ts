import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmpBotonIconoHrzComponent } from './cmp-boton-icono-hrz.component';

describe('CmpBotonIconoHrzComponent', () => {
  let component: CmpBotonIconoHrzComponent;
  let fixture: ComponentFixture<CmpBotonIconoHrzComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmpBotonIconoHrzComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmpBotonIconoHrzComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
