import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, ViewChild, inject } from '@angular/core';
import { ApIModule } from '../api-endpints';
import { HomeBtn } from './home-btn/home-btn';

type HashResponse = {
  hash?: string;
};

@Component({
  selector: 'app-hashing',
  imports: [HomeBtn],
  templateUrl: './hashing.html',
  styleUrl: './hashing.scss',
})
export class Hashing {
  private readonly http = inject(HttpClient);
  private readonly cdr = inject(ChangeDetectorRef);

  @ViewChild('algorithmSelect') private algorithmSelect?: ElementRef<HTMLSelectElement>;
  @ViewChild('textInput') private textInput?: ElementRef<HTMLInputElement>;

  result = { converted: '' };

  loadHash(): void {
    const algorithm = this.algorithmSelect?.nativeElement.value?.trim();
    const text = this.textInput?.nativeElement.value ?? '';

    if (!algorithm) {
      console.warn('No hash algorithm selected.');
      return;
    }

    const params = new HttpParams().set('data', text);
    const url = `${ApIModule.getApiHash()}/${algorithm}`;

    this.http
      .post<HashResponse>(url, params.toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      })
      .subscribe({
        next: (response) => {
          this.result = { converted: response.hash ?? '' };
          this.cdr.detectChanges();
        },
        error: (error: HttpErrorResponse) => {
          console.error('Failed to load hash API:', error);
          this.result = { converted: '' };
          this.cdr.detectChanges();
        },
      });
  }
}
