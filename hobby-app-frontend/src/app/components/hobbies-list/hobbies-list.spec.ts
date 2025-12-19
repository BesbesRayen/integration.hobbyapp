import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HobbiesList } from './hobbies-list';

describe('HobbiesList', () => {
  let component: HobbiesList;
  let fixture: ComponentFixture<HobbiesList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HobbiesList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HobbiesList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
