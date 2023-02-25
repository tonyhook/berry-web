import { ManagedResource } from '../managed-resource';
import { Tag } from './tag';
import { Topic } from './topic';

export interface Gallery extends ManagedResource {
  type: string;
  image?: string;
  topic?: Topic;
  tags?: Tag[];
}
