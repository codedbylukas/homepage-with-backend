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

    const commentElement = fixture.nativeElement.querySelector('.item');
    expect(commentElement.querySelector('h2').textContent.trim()).toBe('Ada');
    expect(commentElement.querySelector('p').textContent.trim()).toBe('Hello');
  });

  it('should display the empty message when no comments are available', () => {
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.empty')).toBeDefined();
    expect(fixture.nativeElement.textContent).toContain('Keine Kommentare vorhanden.');
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

  const displayedText: string[] = ['Kommentare', '+', 'Home'];

  for (let i = 0; i < displayedText.length; i++) {
    let element: string = displayedText[i];
    it(`the text "${element}" should be in the HTML template`, () => {
      expect(fixture.nativeElement.textContent).toContain(element);
    });
  }

  it('should correctly render a single comment item', () => {
    component.loadNewComments();
    httpMock.expectOne(component.apiEndpoint).flush([{ id: 1, name: 'Ada', comments: 'Hello' }]);
    fixture.detectChanges();

    const commentElement = fixture.nativeElement.querySelector('.item');
    expect(commentElement).toBeDefined();
    expect(commentElement.querySelector('h2').textContent.trim()).toBe('Ada');
    expect(commentElement.querySelector('p').textContent.trim()).toBe('Hello');
  });
  it('should correctly render two comments in the list', () => {
    component.loadNewComments();
    httpMock.expectOne(component.apiEndpoint).flush([
      { id: 1, name: 'Ada', comments: 'Hello' },
      { id: 2, name: 'Bob', comments: 'Hi there' },
    ]);
    fixture.detectChanges();

    const commentItems = fixture.nativeElement.querySelectorAll('.item');
    expect(commentItems.length).toBe(2);

    expect(commentItems[0].textContent).toContain('Ada');
    expect(commentItems[1].textContent).toContain('Bob');
  });

  it('should correctly render a list of five comments', () => {
    component.loadNewComments();
    const mockComments = Array.from({ length: 5 }, (_, i) => ({
      id: i + 1,
      name: `User ${i}`,
      comments: `Comment ${i}`,
    }));
    httpMock.expectOne(component.apiEndpoint).flush(mockComments);
    fixture.detectChanges();
    const commentItems = fixture.nativeElement.querySelectorAll('.item');
    expect(commentItems.length).toBe(5);

    expect(commentItems[0].querySelector('h2').textContent.trim()).toBe('User 0');
    expect(commentItems[0].querySelector('p').textContent.trim()).toBe('Comment 0');
    expect(commentItems[4].querySelector('h2').textContent.trim()).toBe('User 4');
    expect(commentItems[4].querySelector('p').textContent.trim()).toBe('Comment 4');
  });

  it('should handle comments with empty names and content', () => {
    component.loadNewComments();
    httpMock.expectOne(component.apiEndpoint).flush([{ id: 1, name: '', comments: '' }]);
    fixture.detectChanges();

    const commentElement = fixture.nativeElement.querySelector('.item');
    expect(commentElement.querySelector('h2').textContent.trim()).toBe('');
    expect(commentElement.querySelector('p').textContent.trim()).toBe('');
  });

  it('should ensure the "Add" button is present', () => {
    expect(fixture.nativeElement.querySelector('.add')).toBeDefined();
  });
});
