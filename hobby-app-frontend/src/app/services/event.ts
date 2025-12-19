import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { Event } from '../models/event.model';

const API_URL = 'http://localhost:8087';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private http = inject(HttpClient);

  getAllEvents(): Observable<Event[]> {
    console.log('[EventService] Fetching all events from:', `${API_URL}/events`);
    return this.http.get<Event[]>(`${API_URL}/events`).pipe(
      tap((data) => {
        console.log('[EventService] Successfully fetched events:', data);
      }),
      catchError((error) => {
        console.error('[EventService] Error fetching events:', {
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

  getEventsByGroup(groupId: number): Observable<Event[]> {
    console.log('[EventService] Fetching events for group:', groupId);
    return this.http.get<Event[]>(`${API_URL}/events/groups/${groupId}`).pipe(
      tap((data) => {
        console.log('[EventService] Successfully fetched group events:', data);
      }),
      catchError((error) => {
        console.error('[EventService] Error fetching group events:', {
          groupId,
          status: error.status,
          message: error.message,
          error: error.error
        });
        return throwError(() => error);
      })
    );
  }

  createEvent(event: Event): Observable<Event> {
    console.log('[EventService] Creating event:', event);
    return this.http.post<Event>(`${API_URL}/events`, event).pipe(
      tap((data) => {
        console.log('[EventService] Successfully created event:', data);
      }),
      catchError((error) => {
        console.error('[EventService] Error creating event:', {
          status: error.status,
          message: error.message,
          error: error.error
        });
        return throwError(() => error);
      })
    );
  }
}
