import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HobbyDetail } from './hobby-detail';

describe('HobbyDetail', () => {
  let component: HobbyDetail;
  let fixture: ComponentFixture<HobbyDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HobbyDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HobbyDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
