import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
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

  constructor(private tasksService: TasksService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadTasks();
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
      }
    });
  }

  removeTask(taskId: number): void {
    this.tasksService.deleteTask(taskId).subscribe(() => {
      this.loadTasks();
    });
  }
}