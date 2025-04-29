import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TasksState } from './tasks.reducer';

export const selectTasksState = createFeatureSelector<TasksState>('tasks');

export const selectAllTasks = createSelector(
  selectTasksState,
  (state) => state.tasks
);

export const selectLoading = createSelector(
  selectTasksState,
  (state) => state.loading
);

export const selectError = createSelector(
  selectTasksState,
  (state) => state.error
);