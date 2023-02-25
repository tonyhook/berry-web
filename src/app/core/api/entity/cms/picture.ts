import { ContainedManagedResource } from '../contained-managed-resource';
import { Gallery } from './gallery';

export interface Picture extends ContainedManagedResource {
  image: string;
  gallery: Gallery;
}
