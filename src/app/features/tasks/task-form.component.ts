import { Component, inject, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { Task } from './task.model';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatInputModule, MatSelectModule, MatButtonModule],
  template: `
    <form [formGroup]="taskForm" (ngSubmit)="onSubmit()" class="task-form">
      <input matInput placeholder="Title" formControlName="title" />
      <textarea matInput placeholder="Description" formControlName="description"></textarea>

      <mat-select placeholder="Status" formControlName="status">
        <mat-option value="TODO">TODO</mat-option>
        <mat-option value="IN_PROGRESS">IN_PROGRESS</mat-option>
        <mat-option value="DONE">DONE</mat-option>
      </mat-select>

      <mat-select placeholder="Priority" formControlName="priority">
        <mat-option value="Low">Low</mat-option>
        <mat-option value="Medium">Medium</mat-option>
        <mat-option value="High">High</mat-option>
      </mat-select>

      <div class="form-buttons">
        <button mat-raised-button color="primary" type="submit">
          {{ task ? 'Update' : 'Add' }} Task
        </button>
        <button mat-raised-button color="warn" type="button" (click)="onCancel()">Cancel</button>
      </div>
    </form>
  `,
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent {
  private fb = inject(FormBuilder);

  @Input() task: Task | null = null;
  @Output() save = new EventEmitter<Task>();
  @Output() cancel = new EventEmitter<void>(); // <-- output for cancel

  taskForm = this.fb.group({
    title: ['', Validators.required],
    description: [''],
    status: ['TODO', Validators.required],
    priority: ['Low', Validators.required]
  });

  ngOnInit() {
    if (this.task) this.taskForm.patchValue(this.task);
  }

  onSubmit() {
    if (this.taskForm.valid) {
      const formValue = this.taskForm.value;
      const data: Task = {
        id: this.task?.id,
        title: formValue.title || '',
        description: formValue.description || '',
        status: (formValue.status || 'TODO') as 'TODO' | 'IN_PROGRESS' | 'DONE',
        priority: (formValue.priority || 'Low') as 'Low' | 'Medium' | 'High'
      };
      this.save.emit(data);
      this.taskForm.reset({ status: 'TODO', priority: 'Low' });
    }
  }

  onCancel() {
    this.cancel.emit(); 
  }
}
