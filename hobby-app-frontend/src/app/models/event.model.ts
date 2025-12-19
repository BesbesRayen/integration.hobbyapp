import { Group } from './group.model';

export interface Event {
  id?: number;
  title: string;
  description?: string;
  date: string;
  group?: Group;
}

