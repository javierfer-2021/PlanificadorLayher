import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmpDataGridComponent } from './cmp-data-grid.component';

describe('CmpDataGridComponent', () => {
  let component: CmpDataGridComponent;
  let fixture: ComponentFixture<CmpDataGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmpDataGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmpDataGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
