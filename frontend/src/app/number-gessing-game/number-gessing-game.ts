import { Component, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ApIModule } from '../api-endpints';
import { HomeBtn } from './home-btn/home-btn';

@Component({
  selector: 'app-number-gessing-game',
  standalone: true,
  imports: [FormsModule, HomeBtn],
  templateUrl: './number-gessing-game.html',
  styleUrl: './number-gessing-game.scss',
})
export class NumberGessingGame implements OnInit {
  guess: number | null = null;
  current_gess: number | null = null;
  message = '';
  attempts = 0;
  gameWon = false;

  private http = inject(HttpClient);

  data: any;
  localRandomNumber: number = 0;

  apiEndpoint: string = ApIModule.getApiEndpointRandom();

  ngOnInit(): void {
    this.loadNewNumber();
  }

  loadNewNumber(): void {
    this.http.get<any>(this.apiEndpoint).subscribe({
      next: (response) => {
        this.data = response;
        if (typeof response?.randomNumber === 'number') {
          this.localRandomNumber = response.randomNumber;
        }
      },
      error: (err) => {
        console.error('Fehler beim Laden der API:', err);
        this.localRandomNumber = Math.floor(Math.random() * 101);
      },
    });
  }

  checkGuess() {
    try {
      if (this.gameWon) {
        this.message = 'Du hasst schon gewonnen!!!!';
        return;
      }
      if (this.guess === null) {
        this.message = 'Bitte gib eine Zahl ein.';
        return;
      }
      this.attempts++;
      this.current_gess = this.guess;
      if (this.guess === this.localRandomNumber) {
        this.message = 'Richtig! Du hast die Zahl erraten.';
        this.gameWon = true;
      } else if (this.guess < this.localRandomNumber) {
        this.message = 'Deine Zahl ist zu niedrig. Versuche es noch einmal.';
      } else {
        this.message = 'Deine Zahl ist zu hoch. Versuche es noch einmal.';
      }
    } catch (e) {
      console.log('Fehler beim Überprüfen der Zahl.: ' + e);
    }
  }

  resetGame() {
    try {
      this.guess = null;
      this.message = '';
      this.attempts = 0;
      this.gameWon = false;
      this.loadNewNumber();
    } catch (e) {
      console.log('Fehler beim neustarten des Spiels.: ' + e);
    }
  }
}
