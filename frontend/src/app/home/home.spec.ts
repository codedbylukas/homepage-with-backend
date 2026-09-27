import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Home } from './home';

describe('Home', () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  const displayedText: string[] = [
    'Willkommen auf der Hauptseite',
    'Zahl erraten game',
    'Licenses used',
  ];
  for (let i = 0; i < displayedText.length; i++) {
    let element: string = displayedText[i];
    it(`the text "${element}" should be in the HTML template`, () => {
      expect(fixture.nativeElement.textContent).toContain(element);
    });
  }
  const projects: {
    name: string;
  }[] = [
    { name: 'Zahl erraten game' },
    { name: 'Einkaufsliste' },
    { name: 'Encoding' },
    { name: 'Licenses used' },
  ];

  const routes: string[] = ['/number-guessing-game', '/shopping-list', '/encoding', '/license'];

  for (let i = 0; i < projects.length; i++) {
    let usedRoute: string = routes[i];
    let usedProject: {
      name: string;
    } = projects[i];
    it(`should expose project destination ${usedRoute}`, () => {
      const links = (fixture.nativeElement as HTMLElement).querySelectorAll('a');
      const link = Array.from(links).find(
        (element: HTMLAnchorElement) => element.textContent?.trim() === usedProject.name,
      );
      expect(link?.getAttribute('href')).toBe(usedRoute);
    });
  }
});
