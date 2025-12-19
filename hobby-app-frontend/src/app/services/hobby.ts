import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError } from 'rxjs';
import { throwError } from 'rxjs';
import { Hobby } from '../models/hobby.model';
import { Group } from '../models/group.model';
import { AuthService } from './auth';

const API_URL = 'http://localhost:8087';

@Injectable({
  providedIn: 'root',
})
export class HobbyService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  getAllHobbies(): Observable<Hobby[]> {
    console.log('[HobbyService] Fetching all hobbies from:', `${API_URL}/hobbies`);
    return this.http.get<Hobby[]>(`${API_URL}/hobbies`).pipe(
      tap((data) => {
        console.log('[HobbyService] Successfully fetched hobbies:', data);
      }),
      catchError((error) => {
        console.error('[HobbyService] Error fetching hobbies:', {
          status: error.status,
          statusText: error.statusText,
          message: error.message,
          error: error.error,
          url: error.url
        });
        return throwError(() => error);
      })
    );
  }

  getGroupsByHobby(hobbyId: number): Observable<Group[]> {
    console.log('[HobbyService] Fetching groups for hobby:', hobbyId);
    return this.http.get<Group[]>(`${API_URL}/hobbies/${hobbyId}/groups`).pipe(
      tap((data) => {
        console.log('[HobbyService] Successfully fetched groups:', data);
      }),
      catchError((error) => {
        console.error('[HobbyService] Error fetching groups:', {
          hobbyId,
          status: error.status,
          message: error.message,
          error: error.error
        });
        return throwError(() => error);
      })
    );
  }

  joinHobby(hobbyId: number): Observable<any> {
    const currentUser = this.authService.getCurrentUser() as any;
    const userId = currentUser?.id || 0;
    console.log('[HobbyService] Joining hobby:', hobbyId, 'with userId:', userId);
    return this.http.post<any>(`${API_URL}/hobbies/${hobbyId}/join/${userId}`, {}).pipe(
      tap((data) => {
        console.log('[HobbyService] Successfully joined hobby:', data);
      }),
      catchError((error) => {
        console.error('[HobbyService] Error joining hobby:', error);
        return throwError(() => error);
      })
    );
  }
}

