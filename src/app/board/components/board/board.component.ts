import { Component, OnInit, OnDestroy } from '@angular/core';
import { 
  combineLatest, filter,
   map, Observable, takeUntil, Subject } from 'rxjs';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { BoardsService } from '../../../shared/services/boards.service';
import { BoardService } from '../../services/board.service';
import { ColumnsService } from 'src/app/shared/services/columns.service';
import { IBoard } from 'src/app/shared/dtos/board';
import { SocketService } from 'src/app/shared/services/socket.service';
import { EnumSokectEvent } from 'src/app/shared/dtos/socket';
import { IColumn, IColumnRequest } from 'src/app/shared/dtos/column';
import { ITask, ITaskRequest } from 'src/app/shared/dtos/task';
import { TaskService } from 'src/app/shared/services';


@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit, OnDestroy {

  boardId: string;
  data$: Observable<{
    board: IBoard;
    columns: IColumn[];
    tasks: ITask[];
  }>;
  unsubscribe$ = new Subject<void>();

  constructor(
    private boardsService: BoardsService,
    private route: ActivatedRoute,
    private router: Router,
    private boardService: BoardService,
    private socketService: SocketService,
    private columnsService: ColumnsService,
    private taskService: TaskService
  ) {
    const boardId = this.route.snapshot.paramMap.get('id');

    if (!boardId) {
      console.log('Cant get boardID from url')
      throw new Error('Cant get boardID from url');
    }

    this.boardId = boardId;
    this.data$ = combineLatest([
      this.boardService.board$.pipe(filter(Boolean)),
      this.boardService.columns$,
      this.boardService.tasks$,
    ]).pipe(
      map(([board, columns, tasks]) => ({
        board,
        columns,
        tasks
      }))
    );
  }

  ngOnInit(): void {
    this.socketService.emit(EnumSokectEvent.boardsJoin, {
      boardId: this.boardId,
    });
    this.fetchData();
    this.initializeListeners();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  initializeListeners(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.boardService.leaveBoard(this.boardId);
      }
    });

    this.socketService
      .listen<IColumn>(EnumSokectEvent.columnsCreateSuccess)
      .subscribe((column) => {
        this.boardService.addColumn(column);
      });

    this.socketService
      .listen<ITask>(EnumSokectEvent.tasksCreateSuccess)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((task) => {
        this.boardService.addTask(task);
      });

    this.socketService
      .listen<IBoard>(EnumSokectEvent.boardsUpdateSuccess)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((updateBoard) => {
        this.boardService.updateBoard(updateBoard);
      });

    this.socketService
      .listen<void>(EnumSokectEvent.boardsDeleteSuccess)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.router.navigateByUrl('/boards');
      });

    this.socketService
      .listen<IColumn>(EnumSokectEvent.columnsUpdateSuccess)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((updatedColumn) => {
        this.boardService.updateColumn(updatedColumn);
      });

    this.socketService
      .listen<string>(EnumSokectEvent.columnsDeleteSuccess)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((columnId) => {
        this.boardService.deleteColumn(columnId);
      });


  }

  fetchData(): void {
    this.boardsService.getBoard(this.boardId).subscribe((board) => {
      this.boardService.setBoard(board);
    });
    this.columnsService.getColumns(this.boardId).subscribe((columns) => {
      this.boardService.setColumns(columns);
    });
    this.taskService.getTasks(this.boardId).subscribe((tasks) => {
      this.boardService.setTasks(tasks);
    });
  }

  createColumn(title: string): void {
    console.log('Title: ', title)
    const columnInput: IColumnRequest = {
      title,
      boardId: this.boardId,
    };
    this.columnsService.createColumn(columnInput);
  }

  createTask(title: string, columnId: string): void {

    const taskInput: ITaskRequest = {
      title,
      boardId: this.boardId,
      columnId,
    };
    this.taskService.createTask(taskInput);
  }

  getTasksByColumn(columnId: string, tasks: ITask[]): ITask[] {
    return tasks.filter((task) => task.columnId === columnId);
  }

  updateBoardName(boardName: string): void {
    this.boardsService.updateBoard(this.boardId, { title: boardName });
  }

  deleteBoard(): void {
    if(confirm('Are you sure you want to delete the board?')) {
      this.boardsService.deleteBoard(this.boardId);
    }
  }

  deleteColumn(columnId: string): void {
    this.columnsService.deleteColumn(this.boardId, columnId);
  }

  updateColumnName(columnName: string, columnId: string): void {
    this.columnsService.updateColumn(this.boardId, columnId, {
      title: columnName,
    });
  }

}
