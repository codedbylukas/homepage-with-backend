import { ComponentFixture, TestBed } from '@angular/core/testing';
import { render, screen } from '@testing-library/angular';

import { HomeBtn } from './home-btn';
import { provideRouter } from '@angular/router';

describe('HomeBtn', () => {
  let component: HomeBtn;
  let fixture: ComponentFixture<HomeBtn>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeBtn],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeBtn);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show the home link', async () => {
    TestBed.resetTestingModule();
    await render(HomeBtn, { providers: [provideRouter([])] });
    expect(screen.getByText('Home')).toBeTruthy();
  });
});
