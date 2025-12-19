import { Group } from './group.model';

export interface Hobby {
  id?: number;
  name: string;
  description?: string;
  groups?: Group[];
}

