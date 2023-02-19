import { Authority } from './authority';

export interface Role {
  id?: number | null;
  name: string;
  authorities: Authority[];
}
