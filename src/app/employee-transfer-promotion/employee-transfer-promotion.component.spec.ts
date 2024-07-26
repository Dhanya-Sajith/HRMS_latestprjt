import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeTransferPromotionComponent } from './employee-transfer-promotion.component';

describe('EmployeeTransferPromotionComponent', () => {
  let component: EmployeeTransferPromotionComponent;
  let fixture: ComponentFixture<EmployeeTransferPromotionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeTransferPromotionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeTransferPromotionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
