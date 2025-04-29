import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TasksService } from './tasks.service';
import { TaskModalComponent } from './task-modal/task-modal.component';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit {
  tasks: any[] = [];
  displayedColumns: string[] = ['name', 'actions'];

  constructor(private tasksService: TasksService, private dialog: MatDialog, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.loadTasks();
    this.subscribeToRealTimeNotifications();
  }

  loadTasks(): void {
    this.tasksService.getTasks().subscribe((data: any[]) => {
      this.tasks = data;
    });
  }

  openTaskModal(task: any = null): void {
    const dialogRef = this.dialog.open(TaskModalComponent, {
      width: '400px',
      data: task
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadTasks();
        const message = task ? 'Task updated successfully' : 'Task added successfully';
        this.snackBar.open(message, 'Close', { duration: 3000 });
      }
    });
  }

  removeTask(taskId: number): void {
    this.tasksService.deleteTask(taskId).subscribe(() => {
      this.loadTasks();
      this.snackBar.open('Task deleted successfully', 'Close', { duration: 3000 });
    });
  }

  private subscribeToRealTimeNotifications(): void {
    this.tasksService.hubConnection.on('TaskAdded', (task) => {
      this.tasks.push(task);
      this.snackBar.open('Task added in real-time', 'Close', { duration: 3000 });
    });

    this.tasksService.hubConnection.on('TaskUpdated', (updatedTask) => {
      const index = this.tasks.findIndex(task => task.id === updatedTask.id);
      if (index !== -1) {
        this.tasks[index] = updatedTask;
        this.snackBar.open('Task updated in real-time', 'Close', { duration: 3000 });
      }
    });

    this.tasksService.hubConnection.on('TaskDeleted', (taskId) => {
      this.tasks = this.tasks.filter(task => task.id !== taskId);
      this.snackBar.open('Task deleted in real-time', 'Close', { duration: 3000 });
    });
  }
}