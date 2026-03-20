import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GetWordsPage } from './features/vocabulary/components/get-words-page/get-words-page';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  imports: [GetWordsPage],
  styleUrl: './app.css'
})
export class App {
}
