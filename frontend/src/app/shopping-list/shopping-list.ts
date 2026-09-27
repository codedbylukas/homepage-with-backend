import { HttpClient, HttpParams } from '@angular/common/http';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApIModule } from '../api-endpints';
import { HomeBtn } from './home-btn/home-btn';

@Component({
  selector: 'app-shopping-list',
  imports: [CommonModule, HomeBtn],
  templateUrl: './shopping-list.html',
  styleUrl: './shopping-list.scss',
})
export class ShoppingList implements OnInit {
  itemName: string | null = '';
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);

  items: any[] = [];
  apiEndpoint: string = ApIModule.getApiEndpointShoppingListGet();

  ngOnInit(): void {
    this.loadNewItems();
  }

  loadNewItems(): void {
    try {
      this.http.get<any[]>(this.apiEndpoint).subscribe({
        next: (response) => {
          this.items = response;
          console.log('API-Daten erfolgreich geladen:', this.items);
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Fehler beim Laden der API:', err);
        },
      });
    } catch (e) {
      console.log('Fehler beim laden der neuen Items.: ' + e);
    }
  }
  addItem(): void {
    try {
      this.itemName = prompt('Welches Item möchtest du hinzufügen? (Name einfügen): ');
      if (this.itemName === null) {
        return;
      }
      this.http
        .post(this.apiEndpoint, {}, { params: new HttpParams().set('name', this.itemName) })
        .subscribe({
          next: (response) => {
            console.log('Item erfolgreich hinzugefügt: ', response);
            this.loadNewItems();
          },
          error: (err) => {
            console.error('Fehler beim Hinzufügen des Items:', err);
          },
        });
    } catch (e) {
      console.log('Fehler beim hinzufügen der Items' + e);
    }
  }
  deleteItem(itemId: number): void {
    try {
      this.http.delete(`${this.apiEndpoint}/${itemId}`, {}).subscribe({
        next: (response) => {
          console.log('Item erfolgreich gelöscht: ', itemId);
          this.loadNewItems();
        },
        error: (err) => {
          console.error('Fehler beim löschen des objektes', err);
        },
      });
    } catch (e) {
      console.log('Fehler beim löschen des Items.: ' + e);
    }
  }
}
