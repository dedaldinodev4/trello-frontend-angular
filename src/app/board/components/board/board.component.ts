import { Component, OnInit } from '@angular/core';
import { filter, Observable } from 'rxjs';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { BoardsService } from '../../../shared/services/boards.service';
import { BoardSerice } from '../../services/board.service';
import { IBoard } from 'src/app/shared/dtos/board';
import { SocketService } from 'src/app/shared/services/socket.service';
import { EnumSokectEvent } from 'src/app/shared/dtos/socket';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {

  boardId: string;
  board$: Observable<IBoard>;

  constructor(
    private boardsService: BoardsService, 
    private route: ActivatedRoute,
    private boardService: BoardSerice,
    private router: Router,
    private socketService: SocketService
    ) { 
      const id = this.route.snapshot.paramMap.get('id');

      if(!id) {
        throw new Error('Cant get boardID from url');
      }
      this.boardId = id;
      this.board$ = this.boardService.board$.pipe(filter(Boolean))

      
    
    }

  ngOnInit(): void {

    //console.log(this.boardId)
    this.socketService.emit(EnumSokectEvent.boardsJoin, {
      boardId: this.boardId,
  })
    
    this.fetchData()
    this.initializeListeners();
  }

  initializeListeners(): void {
    this.router.events.subscribe((event) => {
      if( event instanceof NavigationStart) {
        this.boardService.leaveBoard(this.boardId)
      }
    })
  }

  fetchData(): void {
    this.boardsService.getBoard(this.boardId).subscribe((board) => {
     this.boardService.setBoard(board)
    })
  }

}
