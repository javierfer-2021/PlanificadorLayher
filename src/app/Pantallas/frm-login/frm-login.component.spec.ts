import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrmLoginComponent } from './frm-login.component';

describe('FrmLoginComponent', () => {
  let component: FrmLoginComponent;
  let fixture: ComponentFixture<FrmLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrmLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrmLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
