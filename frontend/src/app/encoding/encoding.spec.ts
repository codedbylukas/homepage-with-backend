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
});
