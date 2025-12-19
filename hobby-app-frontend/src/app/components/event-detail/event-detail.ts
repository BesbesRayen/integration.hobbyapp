import { Component, OnInit, inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EventService } from '../../services/event';
import { AuthService } from '../../services/auth';
import { Event } from '../../models/event.model';

@Component({
  selector: 'app-event-detail',
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './event-detail.html',
  styleUrl: './event-detail.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventDetail implements OnInit {
  private eventService = inject(EventService);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  event: Event | null = null;
  isLoading: boolean = true;
  currentUser: any;
  isMember: boolean = false;
  accessDenied: boolean = false;

  ngOnInit() {
    console.log('[EventDetail] Component initialized');
    this.currentUser = this.authService.getCurrentUser();
    const eventId = this.route.snapshot.paramMap.get('id');
    if (eventId) {
      this.loadEvent(+eventId);
    }
  }

  loadEvent(eventId: number) {
    console.log('[EventDetail] Loading event:', eventId);
    this.eventService.getAllEvents().subscribe({
      next: (events) => {
        this.event = events.find(e => e.id === eventId) || null;
        console.log('[EventDetail] Successfully loaded event:', this.event);
        this.checkIfMember();
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('[EventDetail] Error loading event:', error);
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  checkIfMember() {
    if (this.event?.group && this.currentUser) {
      this.isMember = this.event.group.users?.some(u => u.id === this.currentUser.id) || false;
      if (!this.isMember) {
        this.accessDenied = true;
      }
    }
  }

  navigateToGroup(groupId: number) {
    this.router.navigate(['/groups', groupId]);
  }
}
