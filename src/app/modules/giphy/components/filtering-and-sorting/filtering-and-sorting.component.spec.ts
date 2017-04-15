import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilteringAndSortingComponent } from './filtering-and-sorting.component';

describe('FilteringAndSortingComponent', () => {
  let component: FilteringAndSortingComponent;
  let fixture: ComponentFixture<FilteringAndSortingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilteringAndSortingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilteringAndSortingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
