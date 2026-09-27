import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Hashing } from './hashing';

describe('Hashing', () => {
  let component: Hashing;
  let fixture: ComponentFixture<Hashing>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Hashing],
    }).compileComponents();

    fixture = TestBed.createComponent(Hashing);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
