import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmpInfoGridComponent } from './cmp-info-grid.component';

describe('CmpInfoGridComponent', () => {
  let component: CmpInfoGridComponent;
  let fixture: ComponentFixture<CmpInfoGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmpInfoGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmpInfoGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
