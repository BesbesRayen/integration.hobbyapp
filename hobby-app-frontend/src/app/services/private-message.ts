import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError } from 'rxjs';
import { throwError } from 'rxjs';
import { AuthService } from './auth';

const API_URL = 'http://localhost:8087';

export interface PrivateMessage {
  id?: number;
  senderId: number;
  senderName?: string;
  recipientId: number;
  recipientName?: string;
  content: string;
  createdAt?: string;
  read?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class PrivateMessageService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  sendMessage(recipientId: number, content: string): Observable<PrivateMessage> {
    const currentUser = this.authService.getCurrentUser() as any;
    const senderId = currentUser?.id || 0;
    console.log('[PrivateMessageService] Sending message from:', senderId, 'to:', recipientId);
    return this.http.post<PrivateMessage>(`${API_URL}/messages/send`, { senderId, recipientId, content }).pipe(
      tap((message) => console.log('[PrivateMessageService] Message sent:', message)),
      catchError((error) => {
        console.error('[PrivateMessageService] Error sending message:', error);
        return throwError(() => error);
      })
    );
  }

  getConversation(otherId: number): Observable<PrivateMessage[]> {
    const currentUser = this.authService.getCurrentUser() as any;
    const userId = currentUser?.id || 0;
    console.log('[PrivateMessageService] Fetching conversation between:', userId, 'and:', otherId);
    return this.http.get<PrivateMessage[]>(`${API_URL}/messages/conversation/${userId}/${otherId}`).pipe(
      tap((messages) => console.log('[PrivateMessageService] Conversation fetched:', messages)),
      catchError((error) => {
        console.error('[PrivateMessageService] Error fetching conversation:', error);
        return throwError(() => error);
      })
    );
  }

  getInbox(): Observable<PrivateMessage[]> {
    const currentUser = this.authService.getCurrentUser() as any;
    const userId = currentUser?.id || 0;
    console.log('[PrivateMessageService] Fetching inbox for user:', userId);
    return this.http.get<PrivateMessage[]>(`${API_URL}/messages/inbox/${userId}`).pipe(
      tap((messages) => console.log('[PrivateMessageService] Inbox fetched:', messages)),
      catchError((error) => {
        console.error('[PrivateMessageService] Error fetching inbox:', error);
        return throwError(() => error);
      })
    );
  }

  markAsRead(messageId: number): Observable<string> {
    return this.http.put<string>(`${API_URL}/messages/${messageId}/read`, {}).pipe(
      catchError((error) => {
        console.error('[PrivateMessageService] Error marking as read:', error);
        return throwError(() => error);
      })
    );
  }
}
