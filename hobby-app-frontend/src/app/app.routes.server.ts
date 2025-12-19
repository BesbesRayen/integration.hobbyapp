import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'login',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'register',
    renderMode: RenderMode.Prerender
  },
  // Protected routes - no SSR (client-side only)
  {
    path: 'hobbies/:id',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => []
  },
  {
    path: 'groups',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'groups/:id',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => []
  },
  {
    path: 'events/:id',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => []
  },
  {
    path: 'chat/:groupId',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => []
  },
  {
    path: 'hobbies',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'events',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'profile',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'friends',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'messages',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'messages/:userId',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => []
  },
  {
    path: 'home',
    renderMode: RenderMode.Prerender
  },
  {
    path: '',
    renderMode: RenderMode.Prerender
  }
];
