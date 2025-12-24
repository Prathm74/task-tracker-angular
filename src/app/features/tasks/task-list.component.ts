import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskStore } from './task.store';
import { TaskFormComponent } from './task-form.component';
import { Task } from './task.model';

import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TaskFormComponent,
    MatButtonModule,
    MatSelectModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule
  ],
  template: `
    <div class="task-container">
      <h2>Task Tracker</h2>

      @if (successMessage()) {
        <div class="success-message">{{ successMessage() }}</div>
      }

      @if (showForm) {
        <div class="popup-form">
        <app-task-form 
          [task]="selectedTask"
          (save)="onSave($event)"
          (cancel)="closeForm()">
        </app-task-form>
        </div>
      }
<!-- 
      @if (!showForm) { -->

        <div class="filters-row">
          <mat-form-field appearance="outline">
            <mat-label>Search by title</mat-label>
            <input
              matInput
              [(ngModel)]="searchText"
              (ngModelChange)="currentPage = 1"
              placeholder="Type title"
            />
          </mat-form-field>

          <mat-select [(ngModel)]="filterStatus" placeholder="Status">
            <mat-option value="">All Status</mat-option>
            <mat-option value="TODO">TODO</mat-option>
            <mat-option value="IN_PROGRESS">IN_PROGRESS</mat-option>
            <mat-option value="DONE">DONE</mat-option>
          </mat-select>

          <mat-select [(ngModel)]="filterPriority" placeholder="Priority">
            <mat-option value="">All Priority</mat-option>
            <mat-option value="Low">Low</mat-option>
            <mat-option value="Medium">Medium</mat-option>
            <mat-option value="High">High</mat-option>
          </mat-select>

          <button mat-raised-button color="primary" (click)="openForm(null)">
            Add Task
          </button>
        </div>

        @if (processedTasks().length === 0) {
          <div class="empty-state">
            No tasks found. Click <b>Add Task</b> to create one.
          </div>
        }

        @if (processedTasks().length > 0) {
          <table mat-table [dataSource]="paginatedTasks()" class="full-width-table">

            <ng-container matColumnDef="title">
              <th mat-header-cell *matHeaderCellDef>Title</th>
              <td mat-cell *matCellDef="let task">{{ task.title }}</td>
            </ng-container>

            <ng-container matColumnDef="description">
              <th mat-header-cell *matHeaderCellDef>Description</th>
              <td mat-cell *matCellDef="let task">{{ task.description }}</td>
            </ng-container>

            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Status</th>
              <td mat-cell *matCellDef="let task">{{ task.status }}</td>
            </ng-container>

            <ng-container matColumnDef="priority">
              <th mat-header-cell *matHeaderCellDef>Priority</th>
              <td mat-cell *matCellDef="let task">{{ task.priority }}</td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let task">
                <button mat-button color="primary" (click)="edit(task)">Edit</button>
                <button mat-button color="warn" (click)="task.id && delete(task.id)">
                  Delete
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
          </table>

          <div class="pagination">
            <button mat-button (click)="prevPage()" [disabled]="currentPage === 1">
              Prev
            </button>

            <span>Page {{ currentPage }} of {{ totalPages() }}</span>

            <button
              mat-button
              (click)="nextPage()"
              [disabled]="currentPage === totalPages()">
              Next
            </button>
          </div>
        }
      <!-- } -->
    </div>
  `,
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent {
  private store = inject(TaskStore);

  displayedColumns = ['title', 'description', 'status', 'priority', 'actions'];

  selectedTask: Task | null = null;
  showForm = false;

  filterStatus = '';
  filterPriority = '';
  searchText = '';

  pageSize = 5;
  currentPage = 1;

  successMessage = signal('');

  openForm(task: Task | null) {
    this.selectedTask = task;
    this.showForm = true;
  }

  closeForm() {
    this.selectedTask = null;
    this.showForm = false;
  }

  onSave(task: Task) {
    task.id ? this.store.update(task) : this.store.add(task);
    this.closeForm();
    this.successMessage.set('Task saved successfully!');
    setTimeout(() => this.successMessage.set(''), 3000);
  }

  edit(task: Task) {
    this.openForm(task);
  }

  delete(id: number) {
    this.store.delete(id);
  }

  processedTasks(): Task[] {
    let tasks = this.store.getAll();

    if (this.searchText) {
      const search = this.searchText.toLowerCase();
      tasks = tasks.filter(t =>
        t.title?.toLowerCase().includes(search)
      );
    }

    tasks = tasks.filter(t =>
      (!this.filterStatus || t.status === this.filterStatus) &&
      (!this.filterPriority || t.priority === this.filterPriority)
    );

    return tasks;
  }

  paginatedTasks(): Task[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.processedTasks().slice(start, start + this.pageSize);
  }

  totalPages(): number {
    return Math.ceil(this.processedTasks().length / this.pageSize) || 1;
  }

  nextPage() {
    if (this.currentPage < this.totalPages()) this.currentPage++;
  }

  prevPage() {
    if (this.currentPage > 1) this.currentPage--;
  }
}
