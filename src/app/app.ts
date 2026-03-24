import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { VocabularyPage } from './features/vocabulary/components/vocabulary-page/vocabulary-page';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  imports: [VocabularyPage],
  styleUrl: './app.css'
})
export class App {
}
