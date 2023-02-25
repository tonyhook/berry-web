import { ManagedResource } from '../managed-resource';

export interface Topic extends ManagedResource {
  type: string;
  image?: string;
}
