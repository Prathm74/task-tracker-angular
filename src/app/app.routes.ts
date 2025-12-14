import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login.component';
import { TaskListComponent } from './features/tasks/task-list.component';
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: TaskListComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];
