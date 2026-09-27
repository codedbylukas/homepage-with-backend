import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Hashing } from './hashing';
import { provideRouter } from '@angular/router';
import { render, screen } from '@testing-library/angular';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

describe('Hashing', () => {
  let component: Hashing;
  let fixture: ComponentFixture<Hashing>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Hashing],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(Hashing);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  afterEach(() => httpMock.verify());

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should have a loadHash method', () => {
    expect(component.loadHash).toBeDefined();
  });
  it('should have a loadHash method that is a function', () => {
    expect(typeof component.loadHash).toBe('function');
  });
  it('should have the sha512 text in the template', async () => {
    expect(fixture.nativeElement.querySelector('option[value="sha512"]')?.textContent.trim()).toBe(
      'SHA-512',
    );
  });
  it('should have the md5 text in the template', async () => {
    expect(fixture.nativeElement.querySelector('option[value="md5"]')?.textContent.trim()).toBe(
      'MD5',
    );
  });

  it('should have the sha256 text in the template', async () => {
    expect(fixture.nativeElement.querySelector('option[value="sha256"]')?.textContent.trim()).toBe(
      'SHA-256',
    );
  });

  it('should have the sha1 text in the template', async () => {
    expect(fixture.nativeElement.querySelector('option[value="sha1"]')?.textContent.trim()).toBe(
      'SHA-1',
    );
  });

  it('should have the Hashing text in the template', async () => {
    expect(fixture.nativeElement.textContent).toContain('Hashing');
  });
  it('should have the Convertieren text in the template', async () => {
    expect(fixture.nativeElement.textContent).toContain('Convertieren');
  });
  it('should render the input label text in the template', async () => {
    expect(fixture.nativeElement.textContent).toMatch(
      /Bitte gib mir den Text an, den ich convertieren soll\.:/i,
    );
  });

  ['sha512', 'md5', 'sha256', 'sha1'].forEach((algorithm) => {
    it(`should POST the input as form data for ${algorithm}`, () => {
      (fixture.nativeElement.querySelector('select') as HTMLSelectElement).value = algorithm;
      (fixture.nativeElement.querySelector('#encode-text') as HTMLInputElement).value =
        'hello world';

      component.loadHash();

      const request = httpMock.expectOne(`/api/go/hash/${algorithm}`);
      expect(request.request.method).toBe('POST');
      expect(request.request.headers.get('Content-Type')).toBe('application/x-www-form-urlencoded');
      expect(new URLSearchParams(request.request.body).get('data')).toBe('hello world');
      request.flush({ hash: `${algorithm}-digest` });

      expect(component.result.converted).toBe(`${algorithm}-digest`);
      expect(fixture.nativeElement.textContent).toContain(`${algorithm}-digest`);
    });
  });

  it('should preserve Unicode and reserved characters in the form payload', () => {
    (fixture.nativeElement.querySelector('#encode-text') as HTMLInputElement).value = 'Grüße +&?';

    component.loadHash();

    const request = httpMock.expectOne('/api/go/hash/sha512');
    expect(new URLSearchParams(request.request.body).get('data')).toBe('Grüße +&?');
    request.flush({ hash: 'unicode-digest' });

    expect(component.result.converted).toBe('unicode-digest');
  });

  it('should not send a request when no algorithm is selected', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    (fixture.nativeElement.querySelector('select') as HTMLSelectElement).value = '';

    component.loadHash();

    expect(warnSpy).toHaveBeenCalledWith('No hash algorithm selected.');
    httpMock.expectNone(() => true);
    warnSpy.mockRestore();
  });

  it('should clear a stale digest when the API request fails', () => {
    component.result = { converted: 'stale-digest' };

    component.loadHash();

    const request = httpMock.expectOne('/api/go/hash/sha512');
    request.flush('server error', { status: 500, statusText: 'Server Error' });

    expect(component.result.converted).toBe('');
    expect(fixture.nativeElement.textContent).not.toContain('stale-digest');
  });

  it('should submit the current text from the button and Enter key', () => {
    const input = fixture.nativeElement.querySelector('#encode-text') as HTMLInputElement;
    input.value = 'button value';
    (fixture.nativeElement.querySelector('button') as HTMLButtonElement).click();

    const buttonRequest = httpMock.expectOne('/api/go/hash/sha512');
    expect(new URLSearchParams(buttonRequest.request.body).get('data')).toBe('button value');
    buttonRequest.flush({ hash: 'button-digest' });

    input.value = 'keyboard value';
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

    const keyboardRequest = httpMock.expectOne('/api/go/hash/sha512');
    expect(new URLSearchParams(keyboardRequest.request.body).get('data')).toBe('keyboard value');
    keyboardRequest.flush({ hash: 'keyboard-digest' });
    expect(component.result.converted).toBe('keyboard-digest');
  });
});
