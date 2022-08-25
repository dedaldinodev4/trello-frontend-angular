import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "../auth/services/auth.guard";
import { BoardSerice } from "./services/board.service";
import { BoardComponent } from "./components/board/board.component";

const routes: Routes = [
    {
        path: 'boards/:id',
        component: BoardComponent,
        canActivate: [AuthGuard],
    }
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    declarations: [ BoardComponent],
    providers: [BoardSerice]
})
export class BoardModule {}