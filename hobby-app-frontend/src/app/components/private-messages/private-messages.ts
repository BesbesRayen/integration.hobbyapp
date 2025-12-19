import { Component, OnInit, inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PrivateMessageService, PrivateMessage } from '../../services/private-message';
import { UserService } from '../../services/user';
import { AuthService } from '../../services/auth';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-private-messages',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './private-messages.html',
  styleUrl: './private-messages.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrivateMessagesComponent implements OnInit {
  private messageService = inject(PrivateMessageService);
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

  messages: PrivateMessage[] = [];
  messageForm: FormGroup;
  isLoading: boolean = true;
  isSending: boolean = false;
  otherUser: User | null = null;
  currentUser: any;

  constructor() {
    this.messageForm = this.fb.group({
      content: ['', [Validators.required, Validators.minLength(1)]]
    });
  }

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.route.params.subscribe((params) => {
      const userId = params['userId'];
      if (userId) {
        this.loadUserAndMessages(userId);
      } else {
        this.loadInbox();
      }
    });
  }

  loadUserAndMessages(userId: number) {
    this.userService.getUserById(userId).subscribe({
      next: (user) => {
        this.otherUser = user;
        this.loadConversation(userId);
      },
      error: (error) => {
        console.error('Error loading user:', error);
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  loadConversation(userId: number) {
    this.messageService.getConversation(userId).subscribe({
      next: (data) => {
        this.messages = data;
        this.isLoading = false;
        this.cdr.markForCheck();
        this.scrollToBottom();
      },
      error: (error) => {
        console.error('Error loading conversation:', error);
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  loadInbox() {
    this.messageService.getInbox().subscribe({
      next: (data) => {
        this.messages = data;
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error loading inbox:', error);
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  sendMessage() {
    if (this.messageForm.valid && this.otherUser) {
      this.isSending = true;
      this.cdr.markForCheck();

      this.messageService.sendMessage(this.otherUser.id!, this.messageForm.value.content).subscribe({
        next: (message) => {
          this.messages.push(message);
          this.messageForm.reset();
          this.isSending = false;
          this.cdr.markForCheck();
          this.scrollToBottom();
        },
        error: (error) => {
          console.error('Error sending message:', error);
          this.isSending = false;
          this.cdr.markForCheck();
        }
      });
    }
  }

  openConversation(senderId: number) {
    this.router.navigate(['/messages', senderId]);
  }

  goBackToFriends() {
    this.router.navigate(['/friends']);
  }

  private scrollToBottom() {
    setTimeout(() => {
      const messagesContainer = document.querySelector('.messages-list');
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    }, 100);
  }

  getSenderName(message: PrivateMessage): string {
    return message.senderName || 'Unknown';
  }
}
