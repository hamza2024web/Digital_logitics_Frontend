import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesOrderDetail } from './sales-order-detail';

describe('SalesOrderDetail', () => {
  let component: SalesOrderDetail;
  let fixture: ComponentFixture<SalesOrderDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalesOrderDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesOrderDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
