export interface Task {
  id?: number;
  title?: string;
  description?: string;
  status?: 'TODO' | 'IN_PROGRESS' | 'DONE';
  priority?: 'Low' | 'Medium' | 'High';
}
