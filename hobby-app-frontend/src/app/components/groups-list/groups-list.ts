import { Component, OnInit, inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { GroupService } from '../../services/group';
import { AuthService } from '../../services/auth';
import { Group } from '../../models/group.model';

@Component({
  selector: 'app-groups-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './groups-list.html',
  styleUrl: './groups-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroupsList implements OnInit {
  private groupService = inject(GroupService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  groups: Group[] = [];
  isLoading: boolean = true;
  currentUser: any;
  joiningGroupId: number | null = null;
  joinedGroupIds: Set<number> = new Set();

  ngOnInit() {
    console.log('[GroupsList] Component initialized');
    this.currentUser = this.authService.getCurrentUser();
    this.loadGroups();
  }

  loadGroups() {
    console.log('[GroupsList] Loading groups...');
    this.groupService.getAllGroups().subscribe({
      next: (groups) => {
        console.log('[GroupsList] Successfully loaded groups:', groups);
        this.groups = groups;
        this.isLoading = false;
        
        // Track which groups user is already a member of
        this.joinedGroupIds.clear();
        this.groups.forEach(group => {
          if (group.users?.some(u => u.id === this.currentUser?.id)) {
            this.joinedGroupIds.add(group.id || 0);
          }
        });
        
        console.log('[GroupsList] UI updated with', this.groups.length, 'groups');
        console.log('[GroupsList] User is member of:', Array.from(this.joinedGroupIds));
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('[GroupsList] Error loading groups:', error);
        this.isLoading = false;
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
      console.log('[GroupsList] Already member of group:', groupId);
      this.router.navigate(['/groups', groupId]);
      return;
    }
    
    this.joiningGroupId = groupId;
    console.log('[GroupsList] Joining group:', groupId);
    this.cdr.markForCheck();
    
    this.groupService.joinGroup(groupId).subscribe({
      next: () => {
        console.log('[GroupsList] Successfully joined group:', groupId);
        this.joinedGroupIds.add(groupId);
        this.joiningGroupId = null;
        this.cdr.markForCheck();
        
        // Navigate to group detail page
        setTimeout(() => {
          this.router.navigate(['/groups', groupId]);
        }, 500);
      },
      error: (error) => {
        console.error('[GroupsList] Error joining group:', error);
        this.joiningGroupId = null;
        this.cdr.markForCheck();
      }
    });
  }

  isMember(groupId: number | undefined): boolean {
    if (!groupId) return false;
    return this.joinedGroupIds.has(groupId);
  }
}

