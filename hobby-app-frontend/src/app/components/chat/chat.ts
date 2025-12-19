import { Component, OnInit, OnDestroy, inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { GroupService } from '../../services/group';
import { ChatService } from '../../services/chat';
import { AuthService } from '../../services/auth';
import { Group } from '../../models/group.model';
import { Chat as ChatMessage } from '../../models/chat.model';

@Component({
  selector: 'app-chat',
  imports: [CommonModule, ReactiveFormsModule, RouterLink, DatePipe],
  templateUrl: './chat.html',
  styleUrls: ['./chat.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatComponent implements OnInit, OnDestroy {

  private groupService = inject(GroupService);
  private chatService = inject(ChatService);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

  group: Group | null = null;
  previousGroupId: number | null = null;
  chats: ChatMessage[] = [];
  messageForm: FormGroup;
  isLoading: boolean = true;
  currentUser: any;
  groupId!: number;
  isMember: boolean = false;
  accessDenied: boolean = false;
  loadingTimeout: any = null;
  chatPollInterval: any = null;
  showMembers: boolean = false;

  constructor() {
    this.messageForm = this.fb.group({
      message: ['']
    });
    this.currentUser = this.authService.getCurrentUser();
  }

  ngOnInit() {
    this.groupId = Number(this.route.snapshot.paramMap.get('groupId'));
    this.previousGroupId = this.groupId; // Store for back navigation

    if (this.groupId) {
      this.loadGroup(this.groupId);
    }
  }

  ngOnDestroy() {
    // Clean up interval and timeout when component is destroyed
    if (this.chatPollInterval) {
      clearInterval(this.chatPollInterval);
    }
    if (this.loadingTimeout) {
      clearTimeout(this.loadingTimeout);
    }
  }

  loadGroup(groupId: number) {
    this.groupService.getGroupById(groupId).subscribe({
      next: (group) => {
        this.group = group;
        this.checkIfMember();
        if (this.isMember) {
          this.loadChats(groupId);
          // Set up polling - refresh chats every 3 seconds
          this.chatPollInterval = setInterval(() => this.pollChats(groupId), 3000);
        } else {
          // Already handled in checkIfMember, but ensure loading stops
          this.isLoading = false;
        }
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error loading group:', error);
        this.accessDenied = true;
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  checkIfMember() {
    if (this.group && this.currentUser) {
      this.isMember = this.group.users?.some(u => u.id === this.currentUser.id) || false;
      if (!this.isMember) {
        this.accessDenied = true;
        this.isLoading = false; // Stop loading if not a member
      }
    }
  }

  loadChats(groupId: number) {
    // Set loading timeout of 5 seconds
    if (this.loadingTimeout) {
      clearTimeout(this.loadingTimeout);
    }
    
    this.loadingTimeout = setTimeout(() => {
      if (this.isLoading) {
        this.isLoading = false;
        this.chats = [];
        this.cdr.markForCheck();
      }
    }, 5000);

    this.chatService.getChatsByGroup(groupId).subscribe({
      next: (chats) => {
        clearTimeout(this.loadingTimeout);
        this.chats = chats || [];
        this.isLoading = false;
        this.cdr.markForCheck();
        setTimeout(() => this.scrollToBottom(), 100);
      },
      error: (error) => {
        clearTimeout(this.loadingTimeout);
        console.error('Error loading chats:', error);
        this.chats = [];
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  pollChats(groupId: number) {
    this.chatService.getChatsByGroup(groupId).subscribe({
      next: (chats) => {
        // Only update if we received new messages
        const newChats = chats || [];
        if (newChats.length > this.chats.length) {
          // Check for new messages added by other users
          const lastKnownMessage = this.chats[this.chats.length - 1];
          const newMessages = newChats.filter(chat => 
            !lastKnownMessage || (chat.id && lastKnownMessage.id && chat.id > lastKnownMessage.id)
          );
          
          if (newMessages.length > 0) {
            this.chats.push(...newMessages);
            this.cdr.markForCheck();
            this.scrollToBottom();
          }
        }
      },
      error: (error) => {
        console.error('Error polling chats:', error);
      }
    });
  }

  sendMessage() {
    const message = this.messageForm.value.message?.trim();
    if (!message || !this.groupId || !this.isMember) return;

    const chat: ChatMessage = {
      message: message,
      group: { id: this.groupId } as Group,
      user: this.currentUser
    };

    this.chatService.sendMessage(this.groupId, chat).subscribe({
      next: (savedChat) => {
        this.messageForm.reset();
        this.chats.push(savedChat);
        this.cdr.markForCheck();
        this.scrollToBottom();
      },
      error: (error) => {
        console.error('Error sending message:', error);
      }
    });
  }

  scrollToBottom() {
    const chatContainer = document.querySelector('.chat-messages');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }

  goBack() {
    if (this.previousGroupId) {
      this.router.navigate(['/groups', this.previousGroupId]);
    } else {
      this.router.navigate(['/groups']);
    }
  }

  toggleMembers() {
    this.showMembers = !this.showMembers;
    this.cdr.markForCheck();
  }
}

