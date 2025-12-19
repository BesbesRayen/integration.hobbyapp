import { Hobby } from './hobby.model';
import { User } from './user.model';

export interface Group {
  id?: number;
  hobby?: Hobby;
  name: string;
  description?: string;
  location?: string;
  users?: User[];
  latitude?: number;
  longitude?: number;
}

