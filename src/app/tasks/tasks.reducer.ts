import { createReducer, on } from '@ngrx/store';
import { loadTasks, loadTasksSuccess, loadTasksFailure, addTask, updateTask, deleteTask } from './tasks.actions';
import { Task } from './task.model';

export interface TasksState {
  tasks: Task[];
  loading: boolean;
  error: any;
}

export const initialState: TasksState = {
  tasks: [],
  loading: false,
  error: null,
};

export const tasksReducer = createReducer(
  initialState,
  on(loadTasks, (state) => ({ ...state, loading: true })),
  on(loadTasksSuccess, (state, { tasks }) => ({ ...state, loading: false, tasks })),
  on(loadTasksFailure, (state, { error }) => ({ ...state, loading: false, error })),
  on(addTask, (state, { task }) => ({ ...state, tasks: [...state.tasks, task] })),
  on(updateTask, (state, { task }) => ({
    ...state,
    tasks: state.tasks.map((t) => (t.id === task.id ? task : t)),
  })),
  on(deleteTask, (state, { taskId }) => ({
    ...state,
    tasks: state.tasks.filter((t) => t.id !== taskId),
  }))
);