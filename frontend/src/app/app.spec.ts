import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';
import { routes } from './app.routes';
import { Home } from './home/home';
import { License } from './license/license';
import { NumberGessingGame } from './number-gessing-game/number-gessing-game';
import { ShoppingList } from './shopping-list/shopping-list';
import { Encoding } from './encoding/encoding';
import { Hashing } from './hashing/hashing';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(routes)],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the router outlet for routed pages', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('router-outlet')).toBeTruthy();
  });

  it('should register every frontend page route with its matching component', () => {
    expect(routes.map((route) => route.path)).toEqual([
      '',
      'license',
      'number-guessing-game',
      'shopping-list',
      'encoding',
      'hashing',
    ]);
    expect(routes.map((route) => route.component)).toEqual([
      Home,
      License,
      NumberGessingGame,
      ShoppingList,
      Encoding,
      Hashing,
    ]);
  });
});
