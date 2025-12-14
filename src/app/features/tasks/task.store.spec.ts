import { TaskStore } from './task.store';
import { Task } from './task.model';

describe('TaskStore', () => {
  let store: TaskStore;

  beforeEach(() => {
    localStorage.clear();
    store = new TaskStore();
  });

  it('should add a task', () => {
    const task: Task = {
      id: 1,
      title: 'Test Task',
      description: 'Testing',
      status: 'TODO',
      priority: 'Low'
    };

    store.add(task);
    expect(store.getAll().length).toBe(1);
  });

  it('should update a task', () => {
    store.add({
      id: 1,
      title: 'Old Title',
      description: '',
      status: 'TODO',
      priority: 'Low'
    });

    store.update({
      id: 1,
      title: 'New Title',
      description: '',
      status: 'TODO',
      priority: 'Low'
    });

    expect(store.getAll()[0].title).toBe('New Title');
  });

  it('should delete a task', () => {
    store.add({
      id: 1,
      title: 'Delete Task',
      description: '',
      status: 'TODO',
      priority: 'Low'
    });

    store.delete(1);
    expect(store.getAll().length).toBe(0);
  });
});
