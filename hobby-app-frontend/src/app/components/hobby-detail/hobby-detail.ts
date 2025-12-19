import { Component, OnInit, inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HobbyService } from '../../services/hobby';
import { GroupService } from '../../services/group';
import { AuthService } from '../../services/auth';
import { Hobby } from '../../models/hobby.model';
import { Group } from '../../models/group.model';

@Component({
  selector: 'app-hobby-detail',
  imports: [CommonModule, RouterLink],
  templateUrl: './hobby-detail.html',
  styleUrl: './hobby-detail.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HobbyDetail implements OnInit {
  private hobbyService = inject(HobbyService);
  private groupService = inject(GroupService);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  hobby: Hobby | null = null;
  groups: Group[] = [];
  isLoading: boolean = true;
  joiningGroupId: number | null = null;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  currentUser: any;
  joinedGroupIds: Set<number> = new Set();

  ngOnInit() {
    console.log('[HobbyDetail] Component initialized');
    this.currentUser = this.authService.getCurrentUser();
    const hobbyId = this.route.snapshot.paramMap.get('id');
    if (hobbyId) {
      this.loadHobbyDetails(+hobbyId);
      this.loadGroups(+hobbyId);
    }
  }

  loadHobbyDetails(hobbyId: number) {
    console.log('[HobbyDetail] Loading hobby:', hobbyId);
    // Since we don't have a getById endpoint, we'll load all and filter
    this.hobbyService.getAllHobbies().subscribe({
      next: (hobbies) => {
        this.hobby = hobbies.find(h => h.id === hobbyId) || null;
        console.log('[HobbyDetail] Successfully loaded hobby:', this.hobby);
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('[HobbyDetail] Error loading hobby:', error);
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  loadGroups(hobbyId: number) {
    console.log('[HobbyDetail] Loading groups for hobby:', hobbyId);
    this.hobbyService.getGroupsByHobby(hobbyId).subscribe({
      next: (groups) => {
        console.log('[HobbyDetail] Successfully loaded groups:', groups);
        this.groups = groups;
        
        // Track which groups user is already a member of
        this.joinedGroupIds.clear();
        this.groups.forEach(group => {
          if (group.users?.some(u => u.id === this.currentUser?.id)) {
            this.joinedGroupIds.add(group.id || 0);
          }
        });
        
        console.log('[HobbyDetail] User is member of:', Array.from(this.joinedGroupIds));
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('[HobbyDetail] Error loading groups:', error);
        this.cdr.markForCheck();
      }
    });
  }

  navigateToGroup(groupId: number) {
    this.router.navigate(['/groups', groupId]);
  }

  joinGroup(event: Event, groupId: number) {
    event.stopPropagation();
    event.preventDefault();
    
    if (this.joinedGroupIds.has(groupId)) {
      console.log('[HobbyDetail] Already member of group:', groupId);
      this.navigateToGroup(groupId);
      return;
    }
    
    this.joiningGroupId = groupId;
    this.errorMessage = null;
    this.successMessage = null;
    console.log('[HobbyDetail] Joining group:', groupId);
    this.cdr.markForCheck();
    
    this.groupService.joinGroup(groupId).subscribe({
      next: (response) => {
        console.log('[HobbyDetail] Successfully joined group:', groupId, response);
        this.joinedGroupIds.add(groupId);
        this.successMessage = response?.message || 'Successfully joined group!';
        this.joiningGroupId = null;
        this.cdr.markForCheck();
        
        // Auto-clear success message and redirect after 1 second
        setTimeout(() => {
          this.successMessage = null;
          this.navigateToGroup(groupId);
          this.cdr.markForCheck();
        }, 1000);
      },
      error: (error) => {
        console.error('[HobbyDetail] Error joining group:', error);
        
        // Extract meaningful error message
        let errorMsg = 'Failed to join group';
        if (error.error?.error) {
          errorMsg = error.error.error;
        } else if (error.error?.message) {
          errorMsg = error.error.message;
        } else if (error.status === 404) {
          errorMsg = 'Group not found';
        } else if (error.status === 401) {
          errorMsg = 'Please login first';
        } else if (error.status === 500) {
          errorMsg = 'Server error - please try again later';
        }
        
        this.errorMessage = errorMsg;
        this.joiningGroupId = null;
        this.cdr.markForCheck();
        
        // Auto-clear error message after 5 seconds
        setTimeout(() => {
          this.errorMessage = null;
          this.cdr.markForCheck();
        }, 5000);
      }
    });
  }

  isMember(groupId: number | undefined): boolean {
    if (!groupId) return false;
    return this.joinedGroupIds.has(groupId);
  }
}
