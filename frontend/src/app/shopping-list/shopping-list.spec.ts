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
  it('defined function addItem', async () => {
    expect(component.addItem).toBeDefined();
  });
  it('defined function deleteItem', async () => {
    expect(component.deleteItem).toBeDefined();
  });
});
