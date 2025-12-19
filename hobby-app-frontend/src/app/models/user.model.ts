import { Group } from './group.model';

export interface User {
  id?: number;
  email: string;
  phone?: string;
  password?: string;
  name: string;
  bio?: string;
  groups?: Group[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  phone?: string;
  bio?: string;
}

