import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpParams } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { Comments } from './comments';

describe('Comments', () => {
  let component: Comments;
  let fixture: ComponentFixture<Comments>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Comments],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(Comments);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
    httpMock.expectOne(component.apiEndpoint).flush([]);
    await fixture.whenStable();
  });

  afterEach(() => httpMock.verify());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render comments using the API response fields', () => {
    component.loadNewComments();
    httpMock.expectOne(component.apiEndpoint).flush([{ id: 1, name: 'Ada', comments: 'Hello' }]);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Ada - Hello');
  });

  it('should submit comments as form data and reload them', () => {
    vi.spyOn(globalThis, 'prompt').mockReturnValueOnce('Ada').mockReturnValueOnce('Hello');

    component.addComment();

    const createRequest = httpMock.expectOne(component.apiEndpoint);
    expect(createRequest.request.method).toBe('POST');
    expect(createRequest.request.body).toBeInstanceOf(HttpParams);
    expect(createRequest.request.body.get('title')).toBe('Ada');
    expect(createRequest.request.body.get('description')).toBe('Hello');
    createRequest.flush(null, { status: 201, statusText: 'Created' });
    httpMock.expectOne(component.apiEndpoint).flush([]);
  });

  it('should delete a comment by its route id and reload them', () => {
    component.deleteComment(7);

    const deleteRequest = httpMock.expectOne(`${component.apiEndpoint}/7`);
    expect(deleteRequest.request.method).toBe('DELETE');
    deleteRequest.flush(null);
    httpMock.expectOne(component.apiEndpoint).flush([]);
  });

  const displayedText: string[] = ['Kommentare', '+', 'Home'];

  for (let i = 0; i < displayedText.length; i++) {
    let element: string = displayedText[i];
    it(`the text "${element}" should be in the HTML template`, () => {
      expect(fixture.nativeElement.textContent).toContain(element);
    });
  }
});
