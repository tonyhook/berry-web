import { HierarchyManagedResource } from '../hierarchy-managed-resource';
import { Topic } from './topic';

export interface Column extends HierarchyManagedResource {
  description?: string;
  topic?: Topic;
}
