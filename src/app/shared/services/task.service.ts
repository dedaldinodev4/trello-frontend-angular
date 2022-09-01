import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ITask, ITaskRequest} from '../dtos/task';
import { EnumSokectEvent } from '../dtos/socket';
import { SocketService } from './socket.service';

@Injectable()
export class TaskService {
  constructor(private http: HttpClient, private socketService: SocketService) {}

  getTasks(boardId: string): Observable<ITask[]> {
    const url = `${environment.apiUrl}/boards/${boardId}/tasks`;
    return this.http.get<ITask[]>(url);
  }

  createTask(taskInput: ITaskRequest): void {
    this.socketService.emit(EnumSokectEvent.tasksCreate, taskInput);
  }

  updateTask(
    boardId: string,
    taskId: string,
    fields: { title?: string; description?: string; columnId?: string | null }
  ): void {
    this.socketService.emit(EnumSokectEvent.tasksUpdate, {
      boardId,
      taskId,
      fields,
    });
  }

  deleteTask(boardId: string, taskId: string): void {
    this.socketService.emit(EnumSokectEvent.tasksDelete, { boardId, taskId });
  }
}
