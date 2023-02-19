import { Component, ViewChild, ElementRef } from '@angular/core';

import { MenuService } from '../../../../core';

@Component({
  selector: 'berry-admin-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent {
  @ViewChild('appDrawer') appDrawer: ElementRef | undefined;

  constructor(
    public menuService: MenuService,
  ) { }

}
