import { createAction, props } from '@ngrx/store';
import { Task } from './task.model'

export const loadTasks = createAction('[Tasks] Load Tasks');
export const loadTasksSuccess = createAction('[Tasks] Load Tasks Success', props<{ tasks: Task[] }>());
export const loadTasksFailure = createAction('[Tasks] Load Tasks Failure', props<{ error: any }>());

export const addTask = createAction('[Tasks] Add Task', props<{ task: Task }>());
export const updateTask = createAction('[Tasks] Update Task', props<{ task: Task }>());
export const deleteTask = createAction('[Tasks] Delete Task', props<{ taskId: number }>());