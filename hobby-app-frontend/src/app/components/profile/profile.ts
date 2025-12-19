import { Component, OnInit, inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { UserService } from '../../services/user';
import { HobbyService } from '../../services/hobby';
import { GroupService } from '../../services/group';
import { FriendsService } from '../../services/friends';
import { User } from '../../models/user.model';
import { Hobby } from '../../models/hobby.model';
import { Group } from '../../models/group.model';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Profile implements OnInit {
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private hobbyService = inject(HobbyService);
  private groupService = inject(GroupService);
  private friendsService = inject(FriendsService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

  profileForm: FormGroup;
  currentUser: any;
  userHobbies: Hobby[] = [];
  userGroups: Group[] = [];
  userFriends: User[] = [];
  pendingRequests: any[] = [];
  isLoading: boolean = true;
  isSaving: boolean = false;
  successMessage: string = '';

  constructor() {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      bio: [''],
      phone: ['']
    });
  }

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser) {
      this.loadUserProfile();
    } else {
      this.isLoading = false;
      this.cdr.markForCheck();
    }
  }

  loadUserProfile() {
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        console.log('[Profile] User loaded:', user);
        this.currentUser = user;
        this.authService.setCurrentUser(user);
        
        // Populate form with user data
        this.profileForm.patchValue({
          name: user.name || '',
          email: user.email || '',
          bio: user.bio || '',
          phone: user.phone || ''
        });
        
        console.log('[Profile] Form populated with:', this.profileForm.value);
        
        // Load user's hobbies, groups, and friends
        this.loadUserData();
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('[Profile] Error loading user profile:', error);
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }


  loadUserData() {
    console.log('[Profile] Loading user data, currentUser:', this.currentUser);
    
    // Load hobbies
    this.hobbyService.getAllHobbies().subscribe({
      next: (hobbies) => {
        console.log('[Profile] All hobbies fetched:', hobbies);
        console.log('[Profile] User hobbies:', this.currentUser?.hobbies);
        this.userHobbies = hobbies.filter(h => this.currentUser?.hobbies?.some((uh: any) => uh.id === h.id)) || [];
        console.log('[Profile] Filtered user hobbies:', this.userHobbies);
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('[Profile] Error loading hobbies:', error);
      }
    });

    // Load groups
    this.groupService.getAllGroups().subscribe({
      next: (groups) => {
        console.log('[Profile] All groups fetched:', groups);
        console.log('[Profile] User groups from user object:', this.currentUser?.groups);
        this.userGroups = groups.filter(g => this.currentUser?.groups?.some((ug: any) => ug.id === g.id)) || [];
        console.log('[Profile] Filtered user groups:', this.userGroups);
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('[Profile] Error loading groups:', error);
      }
    });

    // Load friends
    if (this.currentUser?.id) {
      this.friendsService.getFriends(this.currentUser.id).subscribe({
        next: (friends) => {
          console.log('[Profile] User friends loaded:', friends);
          this.userFriends = friends || [];
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('[Profile] Error loading friends:', error);
        }
      });
    }

    // Load pending friend requests
    if (this.currentUser?.id) {
      this.friendsService.getPendingRequests(this.currentUser.id).subscribe({
        next: (requests) => {
          console.log('[Profile] Pending requests loaded:', requests);
          this.pendingRequests = requests || [];
          this.isLoading = false;
          this.cdr.markForCheck();
        },
        error: () => {
          console.error('[Profile] Error loading pending requests');
          this.isLoading = false;
          this.cdr.markForCheck();
        }
      });
    }
  }

  acceptFriendRequest(requestId: number) {
    this.friendsService.acceptFriendRequest(requestId).subscribe({
      next: () => {
        this.successMessage = 'Friend request accepted!';
        this.pendingRequests = this.pendingRequests.filter(r => r.id !== requestId);
        setTimeout(() => {
          this.successMessage = '';
          this.cdr.markForCheck();
        }, 3000);
        this.loadUserData(); // Reload friends list
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error accepting friend request:', error);
      }
    });
  }

  rejectFriendRequest(requestId: number) {
    this.friendsService.rejectFriendRequest(requestId).subscribe({
      next: () => {
        this.pendingRequests = this.pendingRequests.filter(r => r.id !== requestId);
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error rejecting friend request:', error);
      }
    });
  }

  onSubmit() {
    if (this.profileForm.valid) {
      this.isSaving = true;
      this.successMessage = '';
      this.cdr.markForCheck();

      const userData: User = {
        ...this.currentUser,
        ...this.profileForm.value
      };

      this.userService.updateUser(userData).subscribe({
        next: (updatedUser) => {
          this.isSaving = false;
          this.currentUser = updatedUser;
          this.authService.setCurrentUser(updatedUser);
          this.successMessage = 'Profile updated successfully!';
          setTimeout(() => {
            this.successMessage = '';
            this.cdr.markForCheck();
          }, 3000);
          this.cdr.markForCheck();
        },
        error: (error) => {
          this.isSaving = false;
          console.error('Error updating profile:', error);
          this.cdr.markForCheck();
        }
      });
    }
  }

  navigateToGroup(groupId: number) {
    this.router.navigate(['/groups', groupId]);
  }

  navigateToHobby(hobbyId: number) {
    this.router.navigate(['/hobbies', hobbyId]);
  }

  navigateToFriend(friendId: number) {
    this.router.navigate(['/profile', friendId]);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
