import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { LoginRequest, RegisterRequest } from '../models/user.model';

const API_URL = 'http://localhost:8087';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  private tokenKey = 'auth_token';
  private userKey = 'current_user';

  private get localStorage(): Storage | null {
    return isPlatformBrowser(this.platformId) ? window.localStorage : null;
  }

  register(request: RegisterRequest): Observable<any> {
    return this.http.post<any>(`${API_URL}/auth/register`, request).pipe(
      tap((response: any) => {
        if (response && response.token) {
          this.setToken(response.token);
          console.log('[AuthService] Token stored for new user');
        }
        if (response && response.user) {
          this.setCurrentUser(response.user);
          console.log('[AuthService] New user stored:', response.user.name);
        }
      })
    );
  }

  login(request: LoginRequest): Observable<any> {
    return this.http.post<any>(`${API_URL}/auth/login`, request).pipe(
      tap((response: any) => {
        if (response && response.token) {
          this.setToken(response.token);
          console.log('[AuthService] Token stored');
        }
        if (response && response.user) {
          this.setCurrentUser(response.user);
          console.log('[AuthService] User stored:', response.user.name);
        }
      })
    );
  }

  logout(): void {
    if (this.localStorage) {
      this.localStorage.removeItem(this.tokenKey);
      this.localStorage.removeItem(this.userKey);
    }
  }

  getToken(): string | null {
    return this.localStorage?.getItem(this.tokenKey) ?? null;
  }

  setToken(token: string): void {
    if (this.localStorage) {
      this.localStorage.setItem(this.tokenKey, token);
    }
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  setCurrentUser(user: unknown): void {
    if (this.localStorage) {
      this.localStorage.setItem(this.userKey, JSON.stringify(user));
    }
  }

  getCurrentUser(): unknown {
    const userStr = this.localStorage?.getItem(this.userKey);
    return userStr ? JSON.parse(userStr) : null;
  }
}
