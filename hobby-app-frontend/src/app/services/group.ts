import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Group } from '../models/group.model';
import { AuthService } from './auth';

const API_URL = 'http://localhost:8087';

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  getAllGroups(): Observable<Group[]> {
    return this.http.get<Group[]>(`${API_URL}/groups`);
  }

  getGroupById(id: number): Observable<Group> {
    return this.http.get<Group>(`${API_URL}/groups/${id}`);
  }

  createGroup(group: Group): Observable<Group> {
    return this.http.post<Group>(`${API_URL}/groups`, group);
  }

  updateGroup(id: number, group: Group): Observable<Group> {
    return this.http.put<Group>(`${API_URL}/groups/${id}`, group);
  }

  deleteGroup(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/groups/${id}`);
  }

  joinGroup(groupId: number): Observable<any> {
    const currentUser = this.authService.getCurrentUser() as any;
    const userId = currentUser?.id || 0;
    return this.http.post<any>(`${API_URL}/groups/${groupId}/join/${userId}`, {});
  }

  leaveGroup(groupId: number): Observable<any> {
    const currentUser = this.authService.getCurrentUser() as any;
    const userId = currentUser?.id || 0;
    return this.http.delete<any>(`${API_URL}/groups/${groupId}/leave/${userId}`);
  }
}
