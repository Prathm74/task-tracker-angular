import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskStore } from './task.store';
import { TaskFormComponent } from './task-form.component';
import { Task } from './task.model';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    TaskFormComponent,
    MatCardModule,
    MatButtonModule,
    MatSelectModule,
    FormsModule
  ],
  template: `
    <div class="task-container">
      <h2>Task Tracker</h2>

      <div *ngIf="successMessage()" class="success-message">
        {{ successMessage() }}
      </div>

      <!-- FORM -->
      <app-task-form
        *ngIf="showForm"
        [task]="selectedTask"
        (save)="onSave($event)"
        (cancel)="showForm = false">
      </app-task-form>

      <!-- LIST -->
      <div *ngIf="!showForm">

        <!-- FILTER + SORT -->
        <div class="filters">
          <mat-select [(ngModel)]="filterStatus" placeholder="Filter by status">
            <mat-option value="">All</mat-option>
            <mat-option value="TODO">TODO</mat-option>
            <mat-option value="IN_PROGRESS">IN_PROGRESS</mat-option>
            <mat-option value="DONE">DONE</mat-option>
          </mat-select>

          <mat-select [(ngModel)]="filterPriority" placeholder="Filter by priority">
            <mat-option value="">All</mat-option>
            <mat-option value="Low">Low</mat-option>
            <mat-option value="Medium">Medium</mat-option>
            <mat-option value="High">High</mat-option>
          </mat-select>

          <mat-select [(ngModel)]="sortBy" placeholder="Sort by">
            <mat-option value="">None</mat-option>
            <mat-option value="priority">Priority</mat-option>
            <mat-option value="status">Status</mat-option>
          </mat-select>

          <mat-select [(ngModel)]="sortOrder" placeholder="Order">
            <mat-option value="asc">Ascending</mat-option>
            <mat-option value="desc">Descending</mat-option>
          </mat-select>
        </div>

        <!-- ADD BUTTON -->
        <div class="add-task-container">
          <button mat-raised-button color="primary" (click)="openForm(null)">
            Add Task
          </button>
        </div>

        <!-- EMPTY STATE -->
        <div class="empty-state" *ngIf="paginatedTasks().length === 0">
          <p>No tasks found.</p>
          <p class="hint">Click <strong>Add Task</strong> to create your first task.</p>
        </div>

        <!-- TASK CARDS -->
        <div *ngFor="let task of paginatedTasks()">
          <mat-card [ngClass]="'task-priority-' + task.priority">
            <h3>{{ task.title }} ({{ task.priority }})</h3>
            <p>{{ task.description }}</p>

            <span class="status-pill" [ngClass]="'status-' + task.status">
              {{ task.status }}
            </span>

            <div style="margin-top: 10px;">
              <button mat-raised-button color="accent" (click)="edit(task)">
                Edit
              </button>
              <button mat-raised-button color="warn"
                (click)="task.id && delete(task.id)">
                Delete
              </button>
            </div>
          </mat-card>
        </div>

        <!-- PAGINATION -->
        <div class="pagination" *ngIf="totalPages() > 1">
          <button mat-button (click)="prevPage()" [disabled]="currentPage === 1">
            Previous
          </button>

          <span>Page {{ currentPage }} of {{ totalPages() }}</span>

          <button mat-button (click)="nextPage()" [disabled]="currentPage === totalPages()">
            Next
          </button>
        </div>

      </div>
    </div>
  `,
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent {
  private store = inject(TaskStore);

  selectedTask: Task | null = null;
  showForm = false;
  successMessage = signal('');

  filterStatus = '';
  filterPriority = '';
  sortBy: 'priority' | 'status' | '' = '';
  sortOrder: 'asc' | 'desc' = 'asc';

  currentPage = 1;
  pageSize = 5;

  onSave(task: Task) {
    task.id ? this.store.update(task) : this.store.add(task);
    this.showForm = false;
    this.selectedTask = null;
    this.currentPage = 1;

    this.successMessage.set('Task saved successfully!');
    setTimeout(() => this.successMessage.set(''), 3000);
  }

  openForm(task: Task | null) {
    this.selectedTask = task;
    this.showForm = true;
  }

  edit(task: Task) {
    this.openForm(task);
  }

  delete(id: number) {
    this.store.delete(id);
  }

  processedTasks(): Task[] {
    let tasks = this.store.getAll();

    tasks = tasks.filter(t =>
      (!this.filterStatus || t.status === this.filterStatus) &&
      (!this.filterPriority || t.priority === this.filterPriority)
    );

    if (this.sortBy === 'priority') {
      tasks = [...tasks].sort((a, b) => {
        const r = a.priority!.localeCompare(b.priority!);
        return this.sortOrder === 'asc' ? r : -r;
      });
    }

    if (this.sortBy === 'status') {
      tasks = [...tasks].sort((a, b) => {
        const r = a.status!.localeCompare(b.status!);
        return this.sortOrder === 'asc' ? r : -r;
      });
    }

    return tasks;
  }

  paginatedTasks(): Task[] {
    const tasks = this.processedTasks();
    const start = (this.currentPage - 1) * this.pageSize;
    return tasks.slice(start, start + this.pageSize);
  }

  totalPages(): number {
    return Math.ceil(this.processedTasks().length / this.pageSize) || 1;
  }

  nextPage() {
    if (this.currentPage < this.totalPages()) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
}
