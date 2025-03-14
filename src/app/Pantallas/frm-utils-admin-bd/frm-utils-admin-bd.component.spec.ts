import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrmUtilsAdminBdComponent } from './frm-utils-admin-bd.component';

describe('FrmUtilsAdminBdComponent', () => {
  let component: FrmUtilsAdminBdComponent;
  let fixture: ComponentFixture<FrmUtilsAdminBdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrmUtilsAdminBdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrmUtilsAdminBdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
