import { Injectable } from '@angular/core';

import { Menu, MenuAPI, MenuTreeNode } from '..';

@Injectable({
  providedIn: 'root',
})
export class MenuService {

  menuItems: MenuTreeNode[] = [];

  constructor(
    private menuAPI: MenuAPI,
  ) { }

  transform(el: Menu): MenuTreeNode {
    const menu: MenuTreeNode = {
      name: el.name,
      sequence: el.sequence ? el.sequence : 0,
      icon: el.icon,
      link: el.link,
      disabled: el.disabled,
      children: [],
    }
    return menu;
  }

  update() {
    this.menuAPI.getMenuList().subscribe({
      next: data => {
        this.menuItems = [];
        const idMapping = data.reduce((acc: number[], el, i) => {
          if (el.id) {
            acc[el.id] = i;
          }
          return acc;
        }, []);
        const newMenu = data.reduce((acc: MenuTreeNode[], el, i) => {
          acc[i] = this.transform(el);
          return acc;
        }, []);
        data.forEach((el, i) => {
          if ((el.parentId == null) || (idMapping[el.parentId] == null)) {
            this.menuItems.push(newMenu[i]);
            this.menuItems.sort(function(a, b) {return a.sequence - b.sequence});
          } else {
            const parentEl = newMenu[idMapping[el.parentId]];
            parentEl.children = [...(parentEl.children || []), newMenu[i]];
            parentEl.children.sort(function(a, b) {return a.sequence - b.sequence});
          }
        });
      },
    });
  }

}
