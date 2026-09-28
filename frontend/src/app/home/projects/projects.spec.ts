import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Projects } from './projects';
import { render, screen } from '@testing-library/angular';
import { provideRouter } from '@angular/router';

describe('Projects', () => {
  it('should create', () => {
    expect(Projects).toBeTruthy();
  });
  const displayedText: string[] = ['Zahl erraten game', 'Einkaufsliste', 'Encoding', 'Hashing'];
  for (let i = 0; i < displayedText.length; i++) {
    let element: string = displayedText[i];
    it(`the text "${element}" should be in the HTML template`, async () => {
      await render(Projects);
      expect(screen.getByText(element)).toBeTruthy();
    });
  }

  it('should show all project links', async () => {
    await render(Projects, { providers: [provideRouter([])] });
    expect(screen.getAllByRole('link')).toHaveLength(4);
  });
  let roles = [
    { name: 'Zahl erraten game' },
    { name: 'Einkaufsliste' },
    { name: 'Encoding' },
    { name: 'Hashing' },
  ];
  let links = ['/number-guessing-game', '/shopping-list', '/encoding', '/hashing'];

  for (let i = 0; i < roles.length; i++) {
    const role = roles[i];
    const link = links[i];
    it('should link each project to its registered route', async () => {
      await render(Projects, { providers: [provideRouter([])] });

      expect(screen.getByRole('link', role).getAttribute('href')).toBe(link);
    });
  }
});
