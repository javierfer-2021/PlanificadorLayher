import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmpBotonesPantallasComponent } from './cmp-botones-pantallas.component';

describe('CmpBotonesPantallasComponent', () => {
  let component: CmpBotonesPantallasComponent;
  let fixture: ComponentFixture<CmpBotonesPantallasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmpBotonesPantallasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmpBotonesPantallasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
