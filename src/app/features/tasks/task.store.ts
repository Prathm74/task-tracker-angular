import { Injectable, signal } from '@angular/core';
import { Task } from './task.model';

@Injectable({ providedIn: 'root' })
export class TaskStore {
  private storageKey = 'task-tracker-tasks';

  tasks = signal<Task[]>([]);

  constructor() {
    this.load();
  }

  private load() {
    const data = localStorage.getItem(this.storageKey);
    this.tasks.set(data ? JSON.parse(data) : []);
  }

  private save() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.tasks()));
  }

  getAll() {
    return this.tasks();
  }

  add(task: Task) {
    const newTask = { ...task, id: task.id ?? Date.now() };
    this.tasks.set([...this.tasks(), newTask]);
    this.save();
  }

  update(task: Task) {
    const updated = this.tasks().map(t => t.id === task.id ? task : t);
    this.tasks.set(updated);
    this.save();
  }

  delete(id: number) {
    this.tasks.set(this.tasks().filter(t => t.id !== id));
    this.save();
  }
}
