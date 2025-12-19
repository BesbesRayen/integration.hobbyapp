import { Component, OnInit, inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { HobbyService } from '../../services/hobby';
import { EventService } from '../../services/event';
import { AuthService } from '../../services/auth';
import { Hobby } from '../../models/hobby.model';
import { Event } from '../../models/event.model';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './home.html',
  styleUrl: './home.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Home implements OnInit {
  private hobbyService = inject(HobbyService);
  private eventService = inject(EventService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  hobbies: Hobby[] = [];
  upcomingEvents: Event[] = [];
  isLoading: boolean = true;
  currentUser: any;

  ngOnInit() {
    console.log('[Home] Component initialized');
    this.currentUser = this.authService.getCurrentUser();
    this.loadHobbiesAndEvents();
  }

  loadHobbiesAndEvents() {
    console.log('[Home] Loading hobbies and events...');
    forkJoin({
      hobbies: this.hobbyService.getAllHobbies(),
      events: this.eventService.getAllEvents()
    }).subscribe({
      next: (result) => {
        console.log('[Home] Data loaded successfully:', {
          hobbiesCount: result.hobbies.length,
          eventsCount: result.events.length,
          hobbies: result.hobbies,
          events: result.events
        });
        this.hobbies = result.hobbies.slice(0, 6);
        this.upcomingEvents = result.events.slice(0, 5);
        this.isLoading = false;
        console.log('[Home] UI updated:', {
          displayedHobbies: this.hobbies.length,
          displayedEvents: this.upcomingEvents.length,
          isLoading: this.isLoading
        });
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('[Home] Error loading data:', {
          status: error.status,
          statusText: error.statusText,
          message: error.message,
          error: error.error,
          stack: error.stack
        });
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  navigateToHobby(hobbyId: number) {
    this.router.navigate(['/hobbies', hobbyId]);
  }

  navigateToEvent(eventId: number) {
    this.router.navigate(['/events', eventId]);
  }
}
