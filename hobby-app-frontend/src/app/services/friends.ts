import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError } from 'rxjs';
import { throwError } from 'rxjs';
import { User } from '../models/user.model';

const API_URL = 'http://localhost:8087';

@Injectable({
  providedIn: 'root',
})
export class FriendsService {
  private http = inject(HttpClient);

  // Get all confirmed friends
  getFriends(userId: number): Observable<User[]> {
    console.log('[FriendsService] Fetching friends list for userId:', userId);
    return this.http.get<User[]>(`${API_URL}/friends/${userId}`).pipe(
      tap((friends) => console.log('[FriendsService] Friends fetched:', friends)),
      catchError((error) => {
        console.error('[FriendsService] Error fetching friends:', error);
        return throwError(() => error);
      })
    );
  }

  // Get pending friend requests
  getPendingRequests(userId: number): Observable<any[]> {
    console.log('[FriendsService] Fetching pending friend requests for userId:', userId);
    return this.http.get<any[]>(`${API_URL}/friends/${userId}/requests/pending`).pipe(
      tap((requests) => console.log('[FriendsService] Pending requests:', requests)),
      catchError((error) => {
        console.error('[FriendsService] Error fetching pending requests:', error);
        return throwError(() => error);
      })
    );
  }

  // Send a friend request
  addFriend(userId: number, friendId: number): Observable<any> {
    console.log('[FriendsService] Sending friend request from:', userId, 'to:', friendId);
    return this.http.post<any>(`${API_URL}/friends/${userId}/${friendId}/request`, {}).pipe(
      tap((response) => console.log('[FriendsService] Friend request sent:', response)),
      catchError((error) => {
        console.error('[FriendsService] Error sending friend request:', error);
        return throwError(() => error);
      })
    );
  }

  // Accept a friend request
  acceptFriendRequest(requestId: number): Observable<any> {
    console.log('[FriendsService] Accepting friend request:', requestId);
    return this.http.post<any>(`${API_URL}/friends/requests/${requestId}/accept`, {}).pipe(
      tap((response) => console.log('[FriendsService] Friend request accepted:', response)),
      catchError((error) => {
        console.error('[FriendsService] Error accepting request:', error);
        return throwError(() => error);
      })
    );
  }

  // Reject a friend request
  rejectFriendRequest(requestId: number): Observable<any> {
    console.log('[FriendsService] Rejecting friend request:', requestId);
    return this.http.post<any>(`${API_URL}/friends/requests/${requestId}/reject`, {}).pipe(
      tap((response) => console.log('[FriendsService] Friend request rejected:', response)),
      catchError((error) => {
        console.error('[FriendsService] Error rejecting request:', error);
        return throwError(() => error);
      })
    );
  }

  // Get friends with common hobbies
  getFriendsWithCommonHobbies(userId: number): Observable<User[]> {
    console.log('[FriendsService] Fetching friends with common hobbies for userId:', userId);
    return this.http.get<User[]>(`${API_URL}/friends/${userId}/common-hobbies`).pipe(
      tap((friends) => console.log('[FriendsService] Friends with common hobbies:', friends)),
      catchError((error) => {
        console.error('[FriendsService] Error fetching friends with common hobbies:', error);
        return throwError(() => error);
      })
    );
  }

  // Remove a friend
  removeFriend(userId: number, friendId: number): Observable<any> {
    console.log('[FriendsService] Removing friend:', friendId, 'for userId:', userId);
    return this.http.delete<any>(`${API_URL}/friends/${userId}/${friendId}`).pipe(
      tap((response) => console.log('[FriendsService] Friend removed:', response)),
      catchError((error) => {
        console.error('[FriendsService] Error removing friend:', error);
        return throwError(() => error);
      })
    );
  }

  // Check if users are friends
  checkIfFriends(userId: number, friendId: number): Observable<boolean> {
    console.log('[FriendsService] Checking friendship between:', userId, 'and:', friendId);
    return this.http.get<boolean>(`${API_URL}/friends/${userId}/check/${friendId}`).pipe(
      catchError((error) => {
        console.error('[FriendsService] Error checking friendship:', error);
        return throwError(() => error);
      })
    );
  }
}
