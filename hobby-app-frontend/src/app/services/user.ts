import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError } from 'rxjs';
import { throwError } from 'rxjs';
import { User } from '../models/user.model';
import { AuthService } from './auth';

const API_URL = 'http://localhost:8087';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  getCurrentUser(): Observable<User> {
    const currentUser = this.authService.getCurrentUser() as any;
    if (!currentUser || !currentUser.id) {
      console.error('[UserService] No current user in localStorage');
      return throwError(() => new Error('User not authenticated'));
    }
    
    console.log('[UserService] Fetching current user with userId:', currentUser.id);
    return this.http.get<User>(`${API_URL}/user/me?userId=${currentUser.id}`).pipe(
      tap((user) => console.log('[UserService] Current user fetched:', user)),
      catchError((error) => {
        console.error('[UserService] Error fetching current user:', error);
        return throwError(() => error);
      })
    );
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${API_URL}/user/${id}`).pipe(
      catchError((error) => {
        console.error('[UserService] Error fetching user by ID:', error);
        return throwError(() => error);
      })
    );
  }

  updateUser(user: User): Observable<User> {
    console.log('[UserService] Updating user:', user);
    return this.http.put<User>(`${API_URL}/user/${user.id}`, user).pipe(
      tap((updatedUser) => console.log('[UserService] User updated:', updatedUser)),
      catchError((error) => {
        console.error('[UserService] Error updating user:', error);
        return throwError(() => error);
      })
    );
  }
}
