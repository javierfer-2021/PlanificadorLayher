import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrmSubfamiliasComponent } from './frm-subfamilias.component';

describe('FrmSubfamiliasComponent', () => {
  let component: FrmSubfamiliasComponent;
  let fixture: ComponentFixture<FrmSubfamiliasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrmSubfamiliasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrmSubfamiliasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
