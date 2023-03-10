import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmdSelectBoxComponent } from './cmd-select-box.component';

describe('CmdSelectBoxComponent', () => {
  let component: CmdSelectBoxComponent;
  let fixture: ComponentFixture<CmdSelectBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmdSelectBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmdSelectBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
