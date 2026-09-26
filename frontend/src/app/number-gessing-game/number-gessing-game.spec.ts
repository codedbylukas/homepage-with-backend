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

  it('should ask for a number when no guess was entered', async () => {
    const { fixture } = await setupComponent();
    const component = fixture.componentInstance;

    component.checkGuess();

    expect(component.message).toBe('Bitte gib eine Zahl ein.');
    expect(component.attempts).toBe(0);
  });

  it('should report whether a guess is too low or too high', async () => {
    const { fixture } = await setupComponent();
    const component = fixture.componentInstance;

    component.guess = 41;
    component.checkGuess();
    expect(component.message).toBe('Deine Zahl ist zu niedrig. Versuche es noch einmal.');

    component.guess = 43;
    component.checkGuess();
    expect(component.message).toBe('Deine Zahl ist zu hoch. Versuche es noch einmal.');
    expect(component.attempts).toBe(2);
  });

  it('should win on the correct guess and reject guesses afterwards', async () => {
    const { fixture } = await setupComponent();
    const component = fixture.componentInstance;

    component.guess = 42;
    component.checkGuess();
    expect(component.gameWon).toBe(true);
    expect(component.message).toBe('Richtig! Du hast die Zahl erraten.');

    component.guess = 41;
    component.checkGuess();
    expect(component.message).toBe('Du hasst schon gewonnen!!!!');
    expect(component.attempts).toBe(1);
  });

  it('should reset the game and request a new number', async () => {
    const { fixture } = await setupComponent();
    const component = fixture.componentInstance;
    component.guess = 42;
    component.checkGuess();

    component.resetGame();
    const request = httpMock.expectOne((request) => request.url.includes('/api/cpp/random'));
    request.flush({ randomNumber: 7 });

    expect(component.guess).toBeNull();
    expect(component.message).toBe('');
    expect(component.attempts).toBe(0);
    expect(component.gameWon).toBe(false);
    expect(component.localRandomNumber).toBe(7);
  });
});

