import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IBoard } from '../dtos/board';

@Injectable()
export class BoardsService {
  constructor(private http: HttpClient) {}

  getBoards(): Observable<IBoard[]> {
    return this.http.get<IBoard[]>(`${environment.apiUrl}/boards`);
  }

  getBoard(id: string): Observable<IBoard> {
    return this.http.get<IBoard>(`${environment.apiUrl}/boards/${id}`);
  }

  createBoard(title: string): Observable<IBoard> {
    return this.http.post<IBoard>(`${environment.apiUrl}/boards`, { title });
  }
}
