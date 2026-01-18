import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseManagerLayout } from './warehouse-manager-layout';

describe('WarehouseManagerLayout', () => {
  let component: WarehouseManagerLayout;
  let fixture: ComponentFixture<WarehouseManagerLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WarehouseManagerLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WarehouseManagerLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
