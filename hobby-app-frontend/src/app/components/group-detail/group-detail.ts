import { Component, OnInit, inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { GroupService } from '../../services/group';
import { AuthService } from '../../services/auth';
import { EventService } from '../../services/event';
import { FriendsService } from '../../services/friends';
import { Group } from '../../models/group.model';
import { Event } from '../../models/event.model';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-group-detail',
  imports: [CommonModule, DatePipe],
  templateUrl: './group-detail.html',
  styleUrl: './group-detail.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroupDetail implements OnInit {

  private groupService = inject(GroupService);
  private authService = inject(AuthService);
  private eventService = inject(EventService);
  private friendsService = inject(FriendsService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  group: Group | null = null;
  events: Event[] = [];
  isLoading: boolean = true;
  isJoining: boolean = false;
  currentUser: any;
  isMember: boolean = false;
  isQuitting: boolean = false;
  friendRequests: Set<number> = new Set();
  friendStatuses: Map<number, boolean> = new Map();
  successMessage: string = '';
  errorMessage: string = '';

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    const groupId = this.route.snapshot.paramMap.get('id');
    if (groupId) {
      this.loadGroup(+groupId);
      this.loadEvents(+groupId);
    }
  }

  loadGroup(groupId: number) {
    this.groupService.getGroupById(groupId).subscribe({
      next: (group) => {
        this.group = group;
        this.checkIfMember();
        this.loadMemberStatuses();
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  checkIfMember() {
    if (this.group && this.currentUser) {
      this.isMember = this.group.users?.some(u => u.id === this.currentUser.id) || false;
    }
  }

  loadEvents(groupId: number) {
    this.eventService.getEventsByGroup(groupId).subscribe({
      next: (events) => {
        this.events = events;
        this.cdr.markForCheck();
      },
      error: () => {
        this.cdr.markForCheck();
      }
    });
  }

  joinGroup() {
    if (!this.group?.id) return;
    this.isJoining = true;
    this.cdr.markForCheck();
    
    this.groupService.joinGroup(this.group.id).subscribe({
      next: () => {
        this.isJoining = false;
        this.isMember = true;
        this.successMessage = 'Successfully joined! Redirecting to chat...';
        this.cdr.markForCheck();
        
        // Redirect to chat after showing message
        setTimeout(() => {
          this.router.navigate(['/chat', this.group!.id]);
        }, 1500);
      },
      error: (error) => {
        this.isJoining = false;
        this.errorMessage = 'Failed to join group. Please try again.';
        console.error('Error joining group:', error);
        this.cdr.markForCheck();
        
        // Clear error message after 4 seconds
        setTimeout(() => {
          this.errorMessage = '';
          this.cdr.markForCheck();
        }, 4000);
      }
    });
  }

  navigateToChat() {
    if (this.group?.id) {
      this.router.navigate(['/chat', this.group.id]);
    }
  }

  navigateToEvent(eventId: number) {
    this.router.navigate(['/events', eventId]);
  }

  loadMemberStatuses() {
    if (!this.group?.users || !this.currentUser?.id) return;
    
    this.group.users.forEach(member => {
      if (member.id && member.id !== this.currentUser?.id) {
        this.friendsService.checkIfFriends(this.currentUser.id, member.id).subscribe({
          next: (isFriend) => {
            this.friendStatuses.set(member.id!, isFriend);
            this.cdr.markForCheck();
          }
        });
      }
    });
  }

  addFriend(member: User) {
    if (!member.id || !this.currentUser?.id) return;
    this.friendsService.addFriend(this.currentUser.id, member.id).subscribe({
      next: (response) => {
        this.successMessage = `Friend request sent to ${member.name}!`;
        this.friendRequests.add(member.id!);
        setTimeout(() => {
          this.successMessage = '';
          this.cdr.markForCheck();
        }, 4000);
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error adding friend:', error);
        this.errorMessage = error.error?.error || 'Failed to send friend request';
        setTimeout(() => {
          this.errorMessage = '';
          this.cdr.markForCheck();
        }, 4000);
        this.cdr.markForCheck();
      }
    });
  }

  isFriend(userId: number | undefined): boolean {
    if (!userId) return false;
    return this.friendStatuses.get(userId) || false;
  }

  isCurrentUser(userId: number | undefined): boolean {
    return userId === this.currentUser?.id;
  }

  getDisplayMembers() {
    if (!this.group?.users) return [];
    // Filter out current user from the display list
    const filtered = this.group.users.filter(u => u.id !== this.currentUser?.id);
    console.log('[GroupDetail] Current user:', this.currentUser?.id, 'All members:', this.group.users, 'Filtered:', filtered);
    return filtered;
  }

  getMembersCount(): number {
    if (!this.group?.users) return 0;
    return this.group.users.length;
  }

  quitGroup() {
    if (!this.group?.id || !this.currentUser?.id) return;
    
    if (!confirm('Are you sure you want to leave this group?')) {
      return;
    }
    
    this.isQuitting = true;
    this.cdr.markForCheck();
    
    this.groupService.leaveGroup(this.group.id).subscribe({
      next: () => {
        this.isQuitting = false;
        this.isMember = false;
        this.successMessage = 'You have left the group. Redirecting...';
        this.cdr.markForCheck();
        
        // Redirect to hobbies after showing message
        setTimeout(() => {
          this.router.navigate(['/hobbies', this.group!.hobby?.id]);
        }, 1500);
      },
      error: (error: any) => {
        this.isQuitting = false;
        this.errorMessage = 'Failed to leave group. Please try again.';
        console.error('Error leaving group:', error);
        this.cdr.markForCheck();
        
        // Clear error message after 4 seconds
        setTimeout(() => {
          this.errorMessage = '';
          this.cdr.markForCheck();
        }, 4000);
      }
    });
  }

  goBack() {
    this.router.navigate(['/hobbies', this.group?.hobby?.id]);
  }
}