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

  it('should display Willkommen auf deiner Einkaufsliste in template', () => {
    expect(fixture.nativeElement.textContent).toContain('Willkommen auf deiner Einkaufsliste');
  });
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
    const request = httpMock.expectOne(
      (request) => request.url === `${component.apiEndpoint}?name=Brot`,
    );
    expect(request.request.method).toBe('POST');
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
});
