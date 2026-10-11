import { HttpClient, HttpParams } from '@angular/common/http';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { ApIModule } from '../api-endpints';
import { HomeBtn } from '../home-btn/home-btn';

interface Bug {
  id: number;
  title: string;
  description: string;
}

@Component({
  selector: 'app-bugs',
  imports: [HomeBtn],
  templateUrl: './bugs.html',
  styleUrl: './bugs.scss',
})
export class Bugs {
  bugTitle: string | null = '';
  bugDescription: string | null = '';
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);
  bugs: Bug[] = [];
  apiEndpoint: string = ApIModule.getApiBugs();

  ngOnInit(): void {
    this.loadNewBugs();
  }

  loadNewBugs(): void {
    try {
      this.http.get<Bug[]>(this.apiEndpoint).subscribe({
        next: (response) => {
          this.bugs = response;
          console.log('API-Daten erfolgreich geladen:', this.bugs);
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Fehler beim Laden der API:', err);
        },
      });
    } catch (e) {
      console.log('Fehler beim laden der neuen Bugs.: ' + e);
    }
  }
  addBug(): void {
    try {
      this.bugTitle = prompt('Um was geht es bei diesem Bug? (Title einfügen): ');
      this.bugDescription = prompt(
        'Gib es bitte noch mit einer genauen Erklärung ein? (Beschreibung einfügen): ',
      );
      if (
        this.bugTitle === null ||
        this.bugDescription === null ||
        this.bugTitle.trim() === '' ||
        this.bugDescription.trim() === ''
      ) {
        return;
      }
      const body = new HttpParams()
        .set('title', this.bugTitle)
        .set('description', this.bugDescription);
      this.http.post(this.apiEndpoint, body).subscribe({
        next: (response) => {
          console.log('Bug erfolgreich hinzugefügt: ', response);
          this.loadNewBugs();
        },
        error: (err) => {
          console.error('Fehler beim Hinzufügen des Bugs:', err);
        },
      });
    } catch (e) {
      console.log('Fehler beim Hinzufügen der Bugs' + e);
    }
  }
}
