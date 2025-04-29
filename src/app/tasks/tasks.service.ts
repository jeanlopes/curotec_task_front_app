import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import * as signalR from '@microsoft/signalr';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  private apiUrl = environment.API_URL; // Base API URL
  public hubConnection!: signalR.HubConnection;

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {
    this.initializeSignalRConnection();
  }

  private initializeSignalRConnection(): void {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${this.apiUrl}/hub`)
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start()
      .then(() => console.log('SignalR connection established.'))
      .catch(err => console.error('Error establishing SignalR connection:', err));

    this.hubConnection.onclose(() => {
      console.warn('SignalR connection closed. Attempting to reconnect...');
    });

    this.registerSignalRHandlers();
  }

  private registerSignalRHandlers(): void {
    this.hubConnection.on('TaskAdded', (task) => {
      console.log('Task added notification received:', task);
      this.snackBar.open('Task added in real-time', 'Close', { duration: 3000 });
    });

    this.hubConnection.on('TaskUpdated', (task) => {
      console.log('Task updated notification received:', task);
      this.snackBar.open('Task updated in real-time', 'Close', { duration: 3000 });
    });

    this.hubConnection.on('TaskDeleted', (taskId) => {
      console.log('Task deleted notification received:', taskId);
      this.snackBar.open('Task deleted in real-time', 'Close', { duration: 3000 });
    });
  }

  getTasks(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  addTask(task: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, task);
  }

  updateTask(task: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${task.id}`, task);
  }

  deleteTask(taskId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${taskId}`);
  }
}