import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmpScrollAreaComponent } from './cmp-scroll-area.component';

describe('CmpScrollAreaComponent', () => {
  let component: CmpScrollAreaComponent;
  let fixture: ComponentFixture<CmpScrollAreaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmpScrollAreaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmpScrollAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
