import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IBoard } from 'src/app/shared/dtos/board';
import { EnumSokectEvent } from 'src/app/shared/dtos/socket';
import { SocketService } from 'src/app/shared/services/';

@Injectable()
export class BoardSerice {
    board$ = new BehaviorSubject<IBoard | null>(null);

    constructor(private socketService: SocketService){}

    setBoard(board: IBoard): void {
        this.board$.next(board);
    }

    leaveBoard(boardId: string): void {
        this.board$.next(null);
        this.socketService.emit(EnumSokectEvent.boardsLeave, { boardId })
    }
}