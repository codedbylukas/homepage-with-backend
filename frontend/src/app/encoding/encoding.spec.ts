import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Encoding } from './encoding';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

describe('Encoding', () => {
  let component: Encoding;
  let fixture: ComponentFixture<Encoding>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Encoding],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(Encoding);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('defined function loadEncoding', async () => {
    expect(component.loadEncoding).toBeDefined();
  });

  it('should request the selected encoding and display the converted result', () => {
    const httpMock = TestBed.inject(HttpTestingController);
    const algorithm = document.getElementById('encode-algo') as HTMLSelectElement;
    const mode = document.getElementById('encode-mode') as HTMLSelectElement;
    const text = document.getElementById('encode-text') as HTMLInputElement;
    algorithm.value = 'base64';
    mode.value = 'from';
    text.value = 'hello world';

    component.loadEncoding();
    const request = httpMock.expectOne('/api/cpp/encode/from-base64/hello%20world');
    expect(request.request.method).toBe('GET');
    request.flush({ converted: 'aGVsbG8gd29ybGQ=' });

    expect(component.result.conveted).toBe('aGVsbG8gd29ybGQ=');
  });

  it('should support the legacy conveted response property', () => {
    const httpMock = TestBed.inject(HttpTestingController);
    component.loadEncoding();
    const request = httpMock.expectOne((request) => request.url.includes('/api/cpp/encode/'));

    request.flush({ conveted: 'legacy-result' });

    expect(component.result.conveted).toBe('legacy-result');
  });

  const algorithms = ['base64', 'hex', 'rot13', 'base32', 'base85'];
  const modes = ['from', 'to'];

  algorithms.forEach((algorithm) => {
    modes.forEach((mode) => {
      it(`should request ${mode}-${algorithm} and store the converted value`, () => {
        const httpMock = TestBed.inject(HttpTestingController);
        (document.getElementById('encode-algo') as HTMLSelectElement).value = algorithm;
        (document.getElementById('encode-mode') as HTMLSelectElement).value = mode;
        (document.getElementById('encode-text') as HTMLInputElement).value = 'payload';

        component.loadEncoding();

        const request = httpMock.expectOne(`/api/cpp/encode/${mode}-${algorithm}/payload`);
        expect(request.request.method).toBe('GET');
        request.flush({ converted: `${mode}:${algorithm}` });

        expect(component.result.conveted).toBe(`${mode}:${algorithm}`);
      });
    });
  });

  it('should URL-encode spaces, reserved characters, and Unicode in the input', () => {
    const httpMock = TestBed.inject(HttpTestingController);
    (document.getElementById('encode-text') as HTMLInputElement).value = 'Grüße /?&#%';

    component.loadEncoding();

    const request = httpMock.expectOne(
      '/api/cpp/encode/from-base64/Gr%C3%BC%C3%9Fe%20%2F%3F%26%23%25',
    );
    request.flush({ converted: 'encoded' });

    expect(component.result.conveted).toBe('encoded');
  });

  it('should prefer converted when both response properties are present', () => {
    const httpMock = TestBed.inject(HttpTestingController);
    component.loadEncoding();
    const request = httpMock.expectOne((request) => request.url.includes('/api/cpp/encode/'));

    request.flush({ converted: 'current-result', conveted: 'legacy-result' });

    expect(component.result.conveted).toBe('current-result');
  });

  it('should preserve the previous result when the API request fails', () => {
    const httpMock = TestBed.inject(HttpTestingController);
    component.result = { conveted: 'previous-result' };
    component.loadEncoding();
    const request = httpMock.expectOne((request) => request.url.includes('/api/cpp/encode/'));

    request.flush('server error', { status: 500, statusText: 'Server Error' });

    expect(component.result.conveted).toBe('previous-result');
  });

  it('should submit through both the button and Enter key and render the result', () => {
    const httpMock = TestBed.inject(HttpTestingController);
    (document.getElementById('encode-text') as HTMLInputElement).value = 'button input';
    (fixture.nativeElement.querySelector('button') as HTMLButtonElement).click();

    const buttonRequest = httpMock.expectOne('/api/cpp/encode/from-base64/button%20input');
    buttonRequest.flush({ converted: 'button result' });
    expect(fixture.nativeElement.textContent).toContain('button result');

    const input = document.getElementById('encode-text') as HTMLInputElement;
    input.value = 'keyboard input';
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

    const keyboardRequest = httpMock.expectOne('/api/cpp/encode/from-base64/keyboard%20input');
    keyboardRequest.flush({ converted: 'keyboard result' });
    expect(fixture.nativeElement.textContent).toContain('keyboard result');
  });

  const displayedText: string[] = [
    'Encoding',
    'from',
    'to',
    'Convertieren',
    'Bitte gib mir den Text an, den ich convertieren soll.: ',
    'base64',
    'hex',
    'rot13',
    'base85',
    'base32',
    'Das erste ist der Encoding algorythus. ',
    'Das zweite ist die Auswahl ob from oder to also, von oder zu der Encoding Methode.',
  ];
  for (let i = 0; i < displayedText.length; i++) {
    let element: string = displayedText[i];
    it(`the text "${element}" should be in the HTML template`, () => {
      expect(fixture.nativeElement.textContent).toContain(element);
    });
  }
});
