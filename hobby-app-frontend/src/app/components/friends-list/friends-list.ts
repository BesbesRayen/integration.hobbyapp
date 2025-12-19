import { Component, OnInit, inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FriendsService } from '../../services/friends';
import { AuthService } from '../../services/auth';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-friends-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './friends-list.html',
  styleUrl: './friends-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FriendsListComponent implements OnInit {
  private friendsService = inject(FriendsService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  friends: User[] = [];
  isLoading: boolean = true;
  removingFriendId: number | null = null;
  currentUser: any;

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.loadFriends();
  }

  loadFriends() {
    this.isLoading = true;
    this.cdr.markForCheck();
    if (this.currentUser?.id) {
      this.friendsService.getFriends(this.currentUser.id).subscribe({
        next: (data) => {
          this.friends = data;
          this.isLoading = false;
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Error loading friends:', error);
          this.isLoading = false;
          this.cdr.markForCheck();
        }
      });
    }
  }

  removeFriend(event: Event, friendId: number) {
    event.stopPropagation();
    this.removingFriendId = friendId;
    this.cdr.markForCheck();

    if (this.currentUser?.id) {
      this.friendsService.removeFriend(this.currentUser.id, friendId).subscribe({
        next: () => {
          this.friends = this.friends.filter(f => f.id !== friendId);
          this.removingFriendId = null;
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Error removing friend:', error);
          this.removingFriendId = null;
          this.cdr.markForCheck();
        }
      });
    }
  }

  navigateToProfile(userId: number) {
    this.router.navigate(['/profile', userId]);
  }

  sendMessage(userId: number) {
    this.router.navigate(['/messages', userId]);
  }

  goBack() {
    this.router.navigate(['/home']);
  }
}
