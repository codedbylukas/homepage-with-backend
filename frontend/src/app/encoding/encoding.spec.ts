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

  it('the text Encoding should be in the HTML template', () => {
    expect(fixture.nativeElement.textContent).toContain('Encoding');
  });

  it('the text from should be in the HTML template', () => {
    expect(fixture.nativeElement.textContent).toContain('from');
  });

  it('the text to should be in the HTML template', () => {
    expect(fixture.nativeElement.textContent).toContain('to');
  });

  it('the text Convertieren should be in the HTML template', () => {
    expect(fixture.nativeElement.textContent).toContain('Convertieren');
  });

  it('the text "Bitte gib mir den Text an, den ich convertieren soll.: " should be in the HTML template', () => {
    expect(fixture.nativeElement.textContent).toContain(
      'Bitte gib mir den Text an, den ich convertieren soll.: ',
    );
  });

  it('the text base64 should be in the HTML template', () => {
    expect(fixture.nativeElement.textContent).toContain('base64');
  });

  it('the text hex should be in the HTML template', () => {
    expect(fixture.nativeElement.textContent).toContain('hex');
  });

  it('the text rot13 should be in the HTML template', () => {
    expect(fixture.nativeElement.textContent).toContain('rot13');
  });

  it('the text base85 should be in the HTML template', () => {
    expect(fixture.nativeElement.textContent).toContain('base85');
  });

  it('the text base32 should be in the HTML template', () => {
    expect(fixture.nativeElement.textContent).toContain('base32');
  });

  it('the text "Das erste ist der Encoding algorythus." should be in the HTML template', () => {
    expect(fixture.nativeElement.textContent).toContain('Das erste ist der Encoding algorythus. ');
  });

  it('the text "Das zweite ist die Auswahl ob from oder to also, von oder zu der Encoding Methode." should be in the HTML template', () => {
    expect(fixture.nativeElement.textContent).toContain(
      'Das zweite ist die Auswahl ob from oder to also, von oder zu der Encoding Methode.',
    );
  });
});
