import { SequenceManagedResource } from '../sequence-managed-resource';

export interface Carousel extends SequenceManagedResource {
  list: string;
  image?: string;
  link?: string;
}
