import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Rigister } from './register';

describe('Rigister', () => {
  let component: Rigister;
  let fixture: ComponentFixture<Rigister>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Rigister]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Rigister);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
