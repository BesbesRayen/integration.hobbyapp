import { Component, OnInit, inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { EventService } from '../../services/event';
import { Event } from '../../models/event.model';

@Component({
  selector: 'app-events-list',
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './events-list.html',
  styleUrl: './events-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventsList implements OnInit {
  private eventService = inject(EventService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  events: Event[] = [];
  isLoading: boolean = true;

  ngOnInit() {
    console.log('[EventsList] Component initialized');
    this.loadEvents();
  }

  loadEvents() {
    console.log('[EventsList] Loading events...');
    this.eventService.getAllEvents().subscribe({
      next: (events) => {
        console.log('[EventsList] Successfully loaded events:', events);
        this.events = events;
        this.isLoading = false;
        console.log('[EventsList] UI updated with', this.events.length, 'events');
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('[EventsList] Error loading events:', error);
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  navigateToEvent(eventId: number) {
    this.router.navigate(['/events', eventId]);
  }
}
