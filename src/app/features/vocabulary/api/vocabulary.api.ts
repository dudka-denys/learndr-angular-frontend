import { inject, Injectable } from '@angular/core';
import { Word } from '../model/word';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Page } from '../model/word-page';

@Injectable({
  providedIn: 'root',
})
export class VocabularyApi {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/api/words';

  getWords(
    page: number = 0,
    size: number = 30,
    sort: string = "created_at,desc",
    searchSubStr: string = "",
    isLearned: boolean | "" = "",
  ): Observable<Page<Word>> {
    let params = new HttpParams().appendAll({
      page: page.toString(),
      size: size.toString(),
      sort: sort,
      searchSubStr: searchSubStr,
      isLearned: isLearned,
    });
    return this.http.get<Page<Word>>(this.baseUrl, { params });
  }

  deleteWord(wordId: number): Observable<void> {
    return this.http.delete<void>(this.baseUrl + '/' + wordId);
  }

  toggleLearned(
    wordId: number,
    isLearned: boolean | "" = ""
  ): Observable<Word> {
    let params = new HttpParams().appendAll(
      {
        isLearned: isLearned,
      }
    );
    return this.http.patch<Word>(`${this.baseUrl}/${wordId}`, { isLearned: isLearned });
  }
  // updateWord(
  //   wordId: number,
  //   word: string = "",
  //   meaning: string = "",
  //   context: string = "",
  //   isLearned: boolean | "" = ""
  // ): Observable<Word> {
  //   let params = new HttpParams().appendAll(
  //     {
  //       word: word,
  //       meaning: meaning,
  //       context: context,
  //       isLearned: isLearned,
  //     }
  //   );
  //   return this.http.patch<Word>(`${this.baseUrl}/${wordId}`, { params });
  // }
}
