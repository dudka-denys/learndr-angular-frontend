import { Component } from '@angular/core';
import { VocabularyPage } from './features/vocabulary/components/vocabulary-page/vocabulary-page';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  imports: [VocabularyPage],
  styleUrl: './app.css'
})
export class App {
}
