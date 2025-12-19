import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login').then(m => m.Login)
  },
  {
    path: 'register',
    loadComponent: () => import('./components/register/register').then(m => m.Register)
  },
  {
    path: 'home',
    loadComponent: () => import('./components/home/home').then(m => m.Home),
    canActivate: [authGuard]
  },
  {
    path: 'hobbies',
    loadComponent: () => import('./components/hobbies-list/hobbies-list').then(m => m.HobbiesList),
    canActivate: [authGuard]
  },
  {
    path: 'hobbies/:id',
    loadComponent: () => import('./components/hobby-detail/hobby-detail').then(m => m.HobbyDetail),
    canActivate: [authGuard]
  },
  {
    path: 'groups',
    loadComponent: () => import('./components/groups-list/groups-list').then(m => m.GroupsList),
    canActivate: [authGuard]
  },
  {
    path: 'groups/:id',
    loadComponent: () => import('./components/group-detail/group-detail').then(m => m.GroupDetail),
    canActivate: [authGuard]
  },
  {
    path: 'events',
    loadComponent: () => import('./components/events-list/events-list').then(m => m.EventsList),
    canActivate: [authGuard]
  },
  {
    path: 'events/:id',
    loadComponent: () => import('./components/event-detail/event-detail').then(m => m.EventDetail),
    canActivate: [authGuard]
  },
  {
    path: 'chat/:groupId',
    loadComponent: () => import('./components/chat/chat').then(m => m.ChatComponent),
    canActivate: [authGuard]
  },
  {
    path: 'profile',
    loadComponent: () => import('./components/profile/profile').then(m => m.Profile),
    canActivate: [authGuard]
  },
  {
    path: 'friends',
    loadComponent: () => import('./components/friends-list/friends-list').then(m => m.FriendsListComponent),
    canActivate: [authGuard]
  },
  {
    path: 'messages',
    loadComponent: () => import('./components/private-messages/private-messages').then(m => m.PrivateMessagesComponent),
    canActivate: [authGuard]
  },
  {
    path: 'messages/:userId',
    loadComponent: () => import('./components/private-messages/private-messages').then(m => m.PrivateMessagesComponent),
    canActivate: [authGuard]
  }
];
