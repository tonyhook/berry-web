import { SequenceManagedResource } from '../sequence-managed-resource';

export interface Popup extends SequenceManagedResource {
  list: string;
  freq?: string;
  terminate?: string;
  image?: string;
  link?: string;
  code?: string;
  startTime?: string;
  endTime?: string;
}
