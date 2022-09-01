import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BoardService } from '../../services/board.service';
import {
  combineLatest,
  filter,
  map,
  Observable,
  Subject,
  takeUntil,
} from 'rxjs';
import { EnumSokectEvent, ITask } from 'src/app/shared/dtos';
import { FormBuilder } from '@angular/forms';
import { IColumn } from 'src/app/shared/dtos';
import { SocketService, TaskService } from 'src/app/shared/services';

@Component({
  selector: 'app-task-modal',
  templateUrl: './task-modal.component.html',
  styleUrls: ['./task-modal.component.scss']
})
export class TaskModalComponent implements OnDestroy, OnInit {

  @HostBinding('class') classes = 'task-modal';

  boardId: string;
  taskId: string;
  task$: Observable<ITask>;
  data$: Observable<{ task: ITask; columns: IColumn[] }>;
  columnForm = this.fb.group({
    columnId: ""
  });
  unsubscribe$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private boardService: BoardService,
    private taskService: TaskService,
    private socketService: SocketService,
    private fb: FormBuilder
  ) {
    const taskId = this.route.snapshot.paramMap.get('taskId');
    const boardId = this.route.parent?.snapshot.paramMap.get('boardId');

    if (!boardId) {
      throw new Error("Can't get boardID from URL");
    }

    if (!taskId) {
      throw new Error("Can't get taskID from URL");
    }

    this.taskId = taskId;
    this.boardId = boardId;
    this.task$ = this.boardService.tasks$.pipe(
      map((tasks) => {
        return tasks.find((task) => task.id === this.taskId);
      }),
      filter(Boolean)
    );
    this.data$ = combineLatest([this.task$, this.boardService.columns$]).pipe(
      map(([task, columns]) => ({
        task,
        columns,
      }))
    );

    this.task$.pipe(takeUntil(this.unsubscribe$)).subscribe((task) => {
      this.columnForm.patchValue({ columnId: task.columnId });
    });

    combineLatest([this.task$, this.columnForm.get('columnId')!.valueChanges])
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(([task, columnId]) => {
        if (task.columnId !== columnId ) {
          this.taskService.updateTask(this.boardId, task.id, { columnId });
        }
      });

    
  }

  ngOnInit(): void {
    this.socketService
      .listen<string>(EnumSokectEvent.tasksDeleteSuccess)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((taskId) => {
        //this.goToBoard();
        console.log(`TaskId: ${taskId}`)
        this.router.navigate(['boards', this.boardId]);
      })
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  goToBoard(): void {
    this.router.navigate(['boards', this.boardId]);
  }

  updateTaskName(taskName: string): void {
    this.taskService.updateTask(this.boardId, this.taskId, {
      title: taskName,
    });
  }

  updateTaskDescription(taskDesctiption: string): void {
    this.taskService.updateTask(this.boardId, this.taskId, {
      description: taskDesctiption,
    });
  }

  deleteTask() {
    if(confirm('Are you sure you want to delete the task?')) {
      this.taskService.deleteTask(this.boardId, this.taskId);
    }
  }

}
