import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoppingList } from './shopping-list';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

describe('ShoppingList', () => {
  let component: ShoppingList;
  let fixture: ComponentFixture<ShoppingList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShoppingList],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(ShoppingList);
    component = fixture.componentInstance;

    fixture.detectChanges();
    const httpMock = TestBed.inject(HttpTestingController);
    httpMock.expectOne(() => true).flush([]);

    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('defined function loadNewItems', async () => {
    expect(component.loadNewItems).toBeDefined();
  });

  it('loadNewItems should be a function', async () => {
    expect(typeof component.loadNewItems).toBe('function');
  });

  it('defined function addItem', async () => {
    expect(component.addItem).toBeDefined();
  });

  it('addItem should be a function', async () => {
    expect(typeof component.addItem).toBe('function');
  });

  it('defined function deleteItem', async () => {
    expect(component.deleteItem).toBeDefined();
  });

  it('deleteItem should be a function', async () => {
    expect(typeof component.deleteItem).toBe('function');
  });

  const displayedText: string[] = ['Willkommen auf deiner Einkaufsliste'];

  for (let i = 0; i < displayedText.length; i++) {
    let element: string = displayedText[i];
    it(`the text "${element}" should be in the HTML template`, () => {
      expect(fixture.nativeElement.textContent).toContain(element);
    });
  }
  it('should load and display shopping list items', () => {
    const httpMock = TestBed.inject(HttpTestingController);
    component.loadNewItems();
    const request = httpMock.expectOne(component.apiEndpoint);
    const items = [{ id: 1, name: 'Milch' }];

    request.flush(items);

    expect(component.items).toEqual(items);
  });

  it('should add a prompted item and reload the list', () => {
    const promptSpy = vi.spyOn(window, 'prompt').mockReturnValue('Brot');
    const httpMock = TestBed.inject(HttpTestingController);
    const loadSpy = vi.spyOn(component, 'loadNewItems');

    component.addItem();
    const request = httpMock.expectOne((request) => request.url === component.apiEndpoint);
    expect(request.request.method).toBe('POST');
    expect(request.request.params.get('name')).toBe('Brot');
    request.flush({ id: 2, name: 'Brot' });

    expect(promptSpy).toHaveBeenCalled();
    expect(loadSpy).toHaveBeenCalled();
    promptSpy.mockRestore();
  });

  it('should not send a request when adding an item is cancelled', () => {
    const promptSpy = vi.spyOn(window, 'prompt').mockReturnValue(null);
    const httpMock = TestBed.inject(HttpTestingController);

    component.addItem();

    expect(promptSpy).toHaveBeenCalled();
    httpMock.expectNone(() => true);
    promptSpy.mockRestore();
  });

  it('should delete an item and reload the list', () => {
    const httpMock = TestBed.inject(HttpTestingController);
    const loadSpy = vi.spyOn(component, 'loadNewItems');

    component.deleteItem(3);
    const request = httpMock.expectOne(`${component.apiEndpoint}/3`);
    expect(request.request.method).toBe('DELETE');
    request.flush(null);

    expect(loadSpy).toHaveBeenCalled();
  });

  it('should preserve special characters in an item name and display the refreshed list', () => {
    const promptSpy = vi.spyOn(window, 'prompt').mockReturnValue('Café & Brot');
    const httpMock = TestBed.inject(HttpTestingController);
    (fixture.nativeElement.querySelector('.add') as HTMLButtonElement).click();

    const addRequest = httpMock.expectOne((request) =>
      request.url.startsWith(component.apiEndpoint),
    );
    expect(addRequest.request.method).toBe('POST');
    expect(addRequest.request.params.get('name')).toBe('Café & Brot');
    addRequest.flush({ id: 7, name: 'Café & Brot' });

    httpMock.expectOne(component.apiEndpoint).flush([{ id: 7, name: 'Café & Brot' }]);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Café & Brot');
    expect(promptSpy).toHaveBeenCalledTimes(1);
    promptSpy.mockRestore();
  });

  it('should delete the rendered item and reload the list when its button is clicked', () => {
    const httpMock = TestBed.inject(HttpTestingController);
    component.loadNewItems();
    httpMock
      .expectOne((request) => request.url === component.apiEndpoint)
      .flush([{ id: 3, name: 'Tea' }]);
    const loadSpy = vi.spyOn(component, 'loadNewItems');

    (fixture.nativeElement.querySelector('.delete') as HTMLButtonElement).click();
    const deleteRequest = httpMock.expectOne(`${component.apiEndpoint}/3`);
    expect(deleteRequest.request.method).toBe('DELETE');
    deleteRequest.flush(null);

    expect(loadSpy).toHaveBeenCalledTimes(1);
    expect(fixture.nativeElement.textContent).toContain('Tea');
  });
});
