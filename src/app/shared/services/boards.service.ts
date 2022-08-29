import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IBoard } from '../dtos/board';
import { SocketService } from './socket.service';
import { EnumSokectEvent } from '../dtos/socket';

@Injectable()
export class BoardsService {
  constructor(
    private http: HttpClient, 
    private socketService: SocketService) {}

  getBoards(): Observable<IBoard[]> {
    return this.http.get<IBoard[]>(`${environment.apiUrl}/boards`);
  }

  getBoard(id: string): Observable<IBoard> {
    return this.http.get<IBoard>(`${environment.apiUrl}/boards/${id}`);
  }

  createBoard(title: string): Observable<IBoard> {
    return this.http.post<IBoard>(`${environment.apiUrl}/boards`, { title });
  }

  updateBoard(boardId: string, fields: { title: string}): void {
    this.socketService.emit(EnumSokectEvent.boardsUpdate, { boardId, fields});
  }

  deleteBoard(boardId: string): void {
    this.socketService.emit(EnumSokectEvent.boardsDelete, { boardId });
  }
}
