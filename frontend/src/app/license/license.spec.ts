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
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show the license heading', async () => {
    expect(fixture.nativeElement.textContent).toContain('Diese Lizenzen wurden genutzt');
  });

  it('should show the Roboto license information', async () => {
    expect(fixture.nativeElement.textContent).toContain(
      'Ich benutze Google Fonts Roboto (Apache 2.0 Lizenz)',
    );
  });

  it('should show the home link', async () => {
    const homeLink = fixture.nativeElement.querySelector('a');
    expect(homeLink?.textContent.trim()).toBe('Home');
  });

  it('should navigate home from the license page', () => {
    const homeLink = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
    expect(homeLink.getAttribute('href')).toBe('/');
  });
});
