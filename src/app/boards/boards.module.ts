import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/services/auth.guard';
import { InlineFormModule } from '../shared/modules/inline-form/inline-form.module';
import { TopbarModule } from '../shared/modules/topbar/topbar.module';
import { BoardsService } from '../shared/services/boards.service';
import { BoardsComponent } from './components/boards/boards.component';

const routes: Routes = [
  {
    path: 'boards' ,
    component: BoardsComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), InlineFormModule, TopbarModule],
  declarations: [BoardsComponent],
  providers: [BoardsService],
})
export class BoardsModule {}
