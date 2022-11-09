import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmpBotonIconoVertComponent } from './cmp-boton-icono-vert.component';

describe('CmpBotonIconoVertComponent', () => {
  let component: CmpBotonIconoVertComponent;
  let fixture: ComponentFixture<CmpBotonIconoVertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmpBotonIconoVertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmpBotonIconoVertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
