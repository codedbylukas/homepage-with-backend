import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Projects } from './projects';
import { render, screen } from '@testing-library/angular';
import { provideRouter } from '@angular/router';

describe('Projects', () => {
  it('should create', () => {
    expect(Projects).toBeTruthy();
  });
  const displayedText: string[] = ['Zahl erraten game', 'Einkaufsliste', 'Encoding'];
  for (let i = 0; i < displayedText.length; i++) {
    let element: string = displayedText[i];
    it(`the text "${element}" should be in the HTML template`, async () => {
      await render(Projects);
      expect(screen.getByText(element)).toBeTruthy();
    });
  }

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
