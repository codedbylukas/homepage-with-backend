import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { render, screen } from '@testing-library/angular';
import { Home } from './home';

describe('Home', () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show the home page heading', async () => {
    TestBed.resetTestingModule();
    await render(Home, { providers: [provideRouter([])] });
    expect(screen.getByText('Willkommen auf der Hauptseite')).toBeTruthy();
  });

  it('should show the projects and footer sections', async () => {
    TestBed.resetTestingModule();
    await render(Home, { providers: [provideRouter([])] });
    expect(screen.getByText('Zahl erraten game')).toBeTruthy();
    expect(screen.getByText('Licenses used')).toBeTruthy();
  });
});
