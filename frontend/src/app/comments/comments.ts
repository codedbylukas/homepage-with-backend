import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { HomeBtn } from '../home-btn/home-btn';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ApIModule } from '../api-endpints';

interface Comment {
  id: number;
  name: string;
  comments: string;
}

@Component({
  selector: 'app-comments',
  imports: [HomeBtn],
  templateUrl: './comments.html',
  styleUrl: './comments.scss',
})
export class Comments {
  commentTitle: string | null = '';
  commentDescription: string | null = '';
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);
  comments: Comment[] = [];
  apiEndpoint: string = ApIModule.getApiComments();

  ngOnInit(): void {
    this.loadNewComments();
  }

  loadNewComments(): void {
    try {
      this.http.get<Comment[]>(this.apiEndpoint).subscribe({
        next: (response) => {
          this.comments = response;
          console.log('API-Daten erfolgreich geladen:', this.comments);
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Fehler beim Laden der API:', err);
        },
      });
    } catch (e) {
      console.log('Fehler beim laden der neuen Comments.: ' + e);
    }
  }
  addComment(): void {
    try {
      this.commentTitle = prompt('Welcher Kommentar möchtest du hinzufügen? (Name einfügen): ');
      this.commentDescription = prompt(
        'Welcher Kommentar möchtest du hinzufügen? (Beschreibung einfügen): ',
      );
      if (
        this.commentTitle === null ||
        this.commentDescription === null ||
        this.commentTitle.trim() === '' ||
        this.commentDescription.trim() === ''
      ) {
        return;
      }
      const body = new HttpParams()
        .set('title', this.commentTitle)
        .set('description', this.commentDescription);
      this.http.post(this.apiEndpoint, body).subscribe({
        next: (response) => {
          console.log('Kommentar erfolgreich hinzugefügt: ', response);
          this.loadNewComments();
        },
        error: (err) => {
          console.error('Fehler beim Hinzufügen des Comments:', err);
        },
      });
    } catch (e) {
      console.log('Fehler beim Hinzufügen der Comments' + e);
    }
  }
}
