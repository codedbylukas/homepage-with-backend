import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Projects } from './projects';
import { render, screen } from '@testing-library/angular';

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
});
