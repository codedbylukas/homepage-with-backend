import { ComponentFixture, TestBed } from '@angular/core/testing';
import { render, screen } from '@testing-library/angular';

import { License } from './license';
import { provideRouter } from '@angular/router';

describe('License', () => {
  let component: License;
  let fixture: ComponentFixture<License>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [License],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(License);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show the license heading', async () => {
    TestBed.resetTestingModule();
    await render(License, { providers: [provideRouter([])] });
    expect(screen.getByText('This Licenses are used')).toBeTruthy();
  });

  it('should show the Roboto license information', async () => {
    TestBed.resetTestingModule();
    await render(License, { providers: [provideRouter([])] });
    expect(screen.getByText('Ich benutze Google Fonts Roboto (Apache 2.0 Lizenz)')).toBeTruthy();
  });

  it('should show the home link', async () => {
    TestBed.resetTestingModule();
    await render(License, { providers: [provideRouter([])] });
    expect(screen.getByRole('link', { name: 'Home' })).toBeTruthy();
  });
});
