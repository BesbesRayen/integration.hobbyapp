import { Component, OnInit, inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HobbyService } from '../../services/hobby';
import { AuthService } from '../../services/auth';
import { Hobby } from '../../models/hobby.model';

@Component({
  selector: 'app-hobbies-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './hobbies-list.html',
  styleUrl: './hobbies-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HobbiesList implements OnInit {
  private hobbyService = inject(HobbyService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  hobbies: Hobby[] = [];
  isLoading: boolean = true;
  currentUser: any;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  ngOnInit() {
    console.log('[HobbiesList] Component initialized');
    this.currentUser = this.authService.getCurrentUser();
    this.loadHobbies();
  }

  loadHobbies() {
    console.log('[HobbiesList] Loading hobbies...');
    this.hobbyService.getAllHobbies().subscribe({
      next: (hobbies) => {
        console.log('[HobbiesList] Successfully loaded hobbies:', hobbies);
        this.hobbies = hobbies;
        this.isLoading = false;
        console.log('[HobbiesList] UI updated with', this.hobbies.length, 'hobbies');
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('[HobbiesList] Error loading hobbies:', error);
        this.isLoading = false;
        this.errorMessage = 'Failed to load hobbies';
        this.cdr.markForCheck();
      }
    });
  }

  navigateToHobby(hobbyId: number) {
    this.router.navigate(['/hobbies', hobbyId]);
  }
}

