import { ComponentFixture, TestBed } from '@angular/core/testing';
import { render, screen } from '@testing-library/angular';
import { Footer } from './footer';

describe('Footer', () => {
  it('should create', () => {
    expect(Footer).toBeTruthy();
  });
  it('should show the licence link', async () => {
    await render(Footer);
    expect(screen.getByText('Licenses used')).toBeTruthy();
  });

  it('should render the footer license text as a link', async () => {
    await render(Footer);
    expect(screen.getByRole('link', { name: 'Licenses used' })).toBeTruthy();
  });
});
