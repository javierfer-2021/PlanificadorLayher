import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrmPrincipalComponent } from './frm-principal.component';

describe('FrmPrincipalComponent', () => {
  let component: FrmPrincipalComponent;
  let fixture: ComponentFixture<FrmPrincipalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrmPrincipalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrmPrincipalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
