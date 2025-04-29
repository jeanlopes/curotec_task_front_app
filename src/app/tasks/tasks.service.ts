import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import * as signalR from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  private apiUrl = environment.API_URL; // Base API URL
  private hubConnection!: signalR.HubConnection;

  constructor(private http: HttpClient) {
    this.initializeSignalRConnection();
  }

  private initializeSignalRConnection(): void {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${this.apiUrl}/hub`) // Replace '/hub' with your SignalR hub endpoint
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
      // Handle task added notification
    });

    this.hubConnection.on('TaskUpdated', (task) => {
      console.log('Task updated notification received:', task);
      // Handle task updated notification
    });

    this.hubConnection.on('TaskDeleted', (taskId) => {
      console.log('Task deleted notification received:', taskId);
      // Handle task deleted notification
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