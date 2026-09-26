import { render, screen } from '@testing-library/angular';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { NumberGessingGame } from './number-gessing-game';

describe('NumberGessingGame', () => {
  let httpMock: HttpTestingController;
  async function setupComponent() {
    const result = await render(NumberGessingGame, {
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    });
    httpMock = TestBed.inject(HttpTestingController);
    const req = httpMock.expectOne((request) => request.url.includes('/api/cpp/random'));
    req.flush({ randomNumber: 42 });
    return result;
  }
  afterEach(() => {
    if (httpMock) {
      httpMock.verify();
    }
  });

  it('should create', async () => {
    const { fixture } = await setupComponent();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('defined function load new number', async () => {
    const { fixture } = await setupComponent();
    const component = fixture.componentInstance;
    expect(component.loadNewNumber).toBeDefined();
  });

  it('defined function check guess', async () => {
    const { fixture } = await setupComponent();
    const component = fixture.componentInstance;
    expect(component.checkGuess).toBeDefined();
  });

  it('defined function reset game', async () => {
    const { fixture } = await setupComponent();
    const component = fixture.componentInstance;
    expect(component.resetGame).toBeDefined();
  });

  it('should create Zahlen erraten text', async () => {
    await setupComponent();
    expect(screen.getByText('Zahlen erraten')).toBeTruthy();
  });

  it('should create gessing text', async () => {
    await setupComponent();
    expect(screen.getByText('Versuche die Zahl zwischen 0 und 100 zu erraten')).toBeTruthy();
  });

  it('should create guess button test', async () => {
    await setupComponent();
    expect(screen.getByText('Guess')).toBeTruthy();
  });
});

