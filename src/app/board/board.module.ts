import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "../auth/services/auth.guard";
import { BoardService } from "./services/board.service";
import { BoardComponent } from "./components/board/board.component";
import { InlineFormModule } from '../shared/modules/inline-form/inline-form.module';
import { TopbarModule } from '../shared/modules/topbar/topbar.module';
import { ColumnsService } from '../shared/services/columns.service';
import { TaskService } from "../shared/services";
import { ReactiveFormsModule } from '@angular/forms';
import { TaskModalComponent } from "./components/task-modal/task-modal.component";

const routes: Routes = [
    {
        path: 'boards/:boardId',
        component: BoardComponent,
        canActivate: [AuthGuard],
        children: [
            {
              path: 'tasks/:taskId',
              component: TaskModalComponent,
            },
        ],
    }
];

@NgModule({
    imports: [
        CommonModule, 
        RouterModule.forChild(routes),
        TopbarModule,
        InlineFormModule,
        ReactiveFormsModule,
    ],
    declarations: [ BoardComponent, TaskModalComponent ],
    providers: [
        BoardService, 
        ColumnsService, 
        TaskService
    ]
})
export class BoardModule {}