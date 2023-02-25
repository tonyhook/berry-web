import { ContainedManagedResource } from '../contained-managed-resource';
import { Column } from './column';
import { Tag } from './tag';

export interface Content extends ContainedManagedResource {
  type: string;
  title?: string;
  subtitle?: string;
  description?: string;
  feedsThumb?: string;
  headerImage?: string;
  article?: string;
  video?: string;
  poster?: string;
  pdf?: string;
  link?: string;
  validTime?: string;
  tags?: Tag[];
  column: Column;
}
