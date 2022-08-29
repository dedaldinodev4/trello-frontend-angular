import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IColumn, IColumnRequest} from '../dtos/column';
import { EnumSokectEvent } from '../dtos/socket';
import { SocketService } from './socket.service';

@Injectable()
export class ColumnsService {
  constructor(private http: HttpClient, private socketService: SocketService) {}

  getColumns(boardId: string): Observable<IColumn[]> {
    const url = `${environment.apiUrl}/boards/${boardId}/columns`;
    return this.http.get<IColumn[]>(url);
  }

  createColumn(columnInput: IColumnRequest): void {
    this.socketService.emit(EnumSokectEvent.columnsCreate, columnInput);
  }

  updateColumn(
    boardId: string,
    columnId: string,
    fields: { title: string }
  ): void {
    this.socketService.emit(EnumSokectEvent.columnsUpdate, {
      boardId, columnId, fields,
    });
  }

  deleteColumn(boardId: string, columnId: string): void {
    this.socketService.emit(EnumSokectEvent.columnsDelete, {
      boardId, columnId
    });
  }
}
