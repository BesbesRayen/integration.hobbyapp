import { Group } from './group.model';
import { User } from './user.model';

export interface Chat {
  id?: number;
  group?: Group;
  user?: User;
  message: string;
  timestamp?: string;
}

