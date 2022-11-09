import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BotonMenuComponent } from './boton-menu.component';

describe('BotonMenuComponent', () => {
  let component: BotonMenuComponent;
  let fixture: ComponentFixture<BotonMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BotonMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BotonMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
