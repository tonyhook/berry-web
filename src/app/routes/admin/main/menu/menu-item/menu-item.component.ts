import { Component, Input, OnInit } from '@angular/core';
import { state, style, transition, animate, trigger } from '@angular/animations';
import { Router, ActivatedRoute } from '@angular/router';

import { DrawerService, MenuTreeNode } from '../../../../../core';

@Component({
  selector: 'berry-admin-menu-item',
  animations: [
    trigger('indicatorRotate', [
      state('collapsed', style({transform: 'rotate(0deg)'})),
      state('expanded', style({transform: 'rotate(180deg)'})),
      transition('expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ])
  ],
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.scss'],
})
export class MenuItemComponent implements OnInit {
  expanded = false;
  onpath = false;
  active = false;
  disabled = false;
  url = '';
  @Input() item?: MenuTreeNode;
  @Input() depth = 0;

  constructor(
    public drawerService: DrawerService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.drawerService.currentUrl.subscribe((url: string) => {
      this.url = url;
      if (typeof this.item !== 'undefined') {
        if (this.item.link && url) {
          this.expanded = url.indexOf(this.item.link) >= 0;
          if (this.item.children && this.item.children.length) {
            this.onpath = url.indexOf(this.item.link) >= 0;
          }
          if (!this.item.children || !this.item.children.length) {
            this.active = url.indexOf(this.item.link) >= 0;
          }
        }
      }
    });
    this.drawerService.currentState.subscribe(() => {
      if (typeof this.item !== 'undefined') {
        if (this.item.link && this.url) {
          this.expanded = this.url.indexOf(this.item.link) >= 0;
        }
      }
    });
    if ((typeof this.item !== 'undefined') && (this.item.disabled != null) && (this.item.disabled == true) && (!this.item.children || !this.item.children.length)) {
      this.disabled = true;
    } else {
      this.disabled = false;
    }
  }

  onItemSelected(item: MenuTreeNode | undefined) {
    if (typeof item == 'undefined') {
      return;
    }

    if (!item.children || !item.children.length) {
      if (!item.disabled) {
        this.drawerService.close();
        this.router.navigate([item.link], {relativeTo: this.route});
      }
    }
    if (item.children && item.children.length) {
      if (this.drawerService.contentMode == 'icon') {
        this.drawerService.open();
        this.expanded = true;
      } else {
        this.expanded = !this.expanded;
      }
    }
  }

}
