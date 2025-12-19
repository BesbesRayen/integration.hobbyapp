import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Chat } from '../models/chat.model';

const API_URL = 'http://localhost:8087';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private http = inject(HttpClient);

  // Note: ChatController needs to be created in backend
  // These endpoints are placeholders for when the controller is added
  getChatsByGroup(groupId: number): Observable<Chat[]> {
    return this.http.get<Chat[]>(`${API_URL}/chat/groups/${groupId}`);
  }

  sendMessage(id: number, chat: Chat): Observable<Chat> {
    return this.http.post<Chat>(`${API_URL}/chat`, chat);
  }
}

