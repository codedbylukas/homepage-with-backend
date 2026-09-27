import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Hashing } from './hashing';
import { provideRouter } from '@angular/router';

describe('Hashing', () => {
  let component: Hashing;
  let fixture: ComponentFixture<Hashing>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Hashing],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Hashing);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
