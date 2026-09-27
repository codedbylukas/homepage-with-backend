import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { ApIModule } from '../api-endpints';
import { HomeBtn } from '../home-btn/home-btn';

@Component({
  selector: 'app-encoding',
  imports: [HomeBtn],
  templateUrl: './encoding.html',
  styleUrl: './encoding.scss',
})
export class Encoding {
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);
  result = { conveted: '' };

  loadEncoding() {
    try {
      const e = document.getElementById('encode-algo') as HTMLSelectElement;
      const mode = document.getElementById('encode-mode') as HTMLSelectElement;
      const text = document.getElementById('encode-text') as HTMLInputElement;
      const encryptionApiString: string = ApIModule.getApiEncode();

      this.http
        .get<any>(
          `${encryptionApiString}/${mode.value}-${e.value}/${encodeURIComponent(text.value)}`,
        )
        .subscribe({
          next: (response) => {
            this.result = { conveted: response.converted || response.conveted };
            this.cdr.detectChanges();
            console.log('Api geladen hier sind die Daten.: ' + this.result.conveted);
          },
          error: (err) => {
            console.error('Fehler beim Laden der API:', err);
          },
        });
    } catch (e) {
      console.log('Fehler beim encoding/decodeing' + e);
    }
  }
}
