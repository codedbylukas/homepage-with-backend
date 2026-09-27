import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Projects } from './projects';
import { render, screen } from '@testing-library/angular';
import { provideRouter } from '@angular/router';

describe('Projects', () => {
  it('should create', () => {
    expect(Projects).toBeTruthy();
  });
  it('should create number gessing game text', async () => {
    await render(Projects);
    expect(screen.getByText('Zahl erraten game')).toBeTruthy();
  });
  it('should create shopping list link text', async () => {
    await render(Projects);
    expect(screen.getByText('Einkaufsliste')).toBeTruthy();
  });

  it('should show the encoding link text', async () => {
    await render(Projects);
    expect(screen.getByText('Encoding')).toBeTruthy();
  });

  it('should show all project links', async () => {
    await render(Projects);
    expect(screen.getAllByRole('link')).toHaveLength(3);
  });

  it('should link each project to its registered route', async () => {
    await render(Projects, { providers: [provideRouter([])] });

    expect(screen.getByRole('link', { name: 'Zahl erraten game' }).getAttribute('href')).toBe(
      '/number-guessing-game',
    );
    expect(screen.getByRole('link', { name: 'Einkaufsliste' }).getAttribute('href')).toBe(
      '/shopping-list',
    );
    expect(screen.getByRole('link', { name: 'Encoding' }).getAttribute('href')).toBe('/encoding');
  });
});
