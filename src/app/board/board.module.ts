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


const routes: Routes = [
    {
        path: 'boards/:id',
        component: BoardComponent,
        canActivate: [AuthGuard],
    }
];

@NgModule({
    imports: [
        CommonModule, 
        RouterModule.forChild(routes),
        TopbarModule,
        InlineFormModule,
    ],
    declarations: [ BoardComponent],
    providers: [
        BoardService, 
        ColumnsService, 
        TaskService
    ]
})
export class BoardModule {}