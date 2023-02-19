import { Injectable } from '@angular/core';

import { MenuTreeNode } from '..';

@Injectable({
  providedIn: 'root',
})
export class MenuService {

  menuItems: MenuTreeNode[] = [];

}
