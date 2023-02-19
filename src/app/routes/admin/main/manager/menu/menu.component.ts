import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';

import { ItemChangeEvent, ItemDeleteEvent, ItemNewEvent, ItemSelectEvent } from 'src/app/shared/treeview/treeview.component';
import { Menu, MenuAPI, MenuService } from '../../../../../core';

@Component({
  selector: 'berry-menu-manager',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuManagerComponent implements OnInit {
  menus: Menu[] = [];
  menu: Menu | null = null;
  formGroup: UntypedFormGroup = this.formBuilder.group({});

  constructor(
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private menuService: MenuService,
    private menuAPI: MenuAPI,
  ) { }

  ngOnInit() {
    combineLatest([
      this.menuAPI.getMenuList(),
      this.route.params,
    ]).subscribe(results => {
      this.menus = results[0];

      if (results[1]['id'] != null) {
        this.setCurrentMenu(+results[1]['id']);
      } else {
        this.menu = null;
      }
    });
  }

  setCurrentMenu(id: number) {
    if (this.menus == null) {
      return;
    }

    const menu = this.menus.find(menu => menu.id == id);

    if (menu != undefined) {
      this.menu = menu;

      this.formGroup = this.formBuilder.group({
        'name': [this.menu.name, Validators.required],
        'icon': [this.menu.icon, Validators.required],
        'link': [this.menu.link, Validators.required],
        'disabled': [this.menu.disabled, null],
      });
    } else {
      this.router.navigateByUrl('/admin/backend/menu');
    }

  }

  changeMenuItem(event: ItemChangeEvent) {
    const menu = this.menus.find(menu => menu.id == event.id);

    if (typeof menu !== 'undefined' && menu.id) {
      if (event.type == 'sequence') {
        if (event.newValue != null) {
          menu.sequence = event.newValue;
        } else {
          menu.sequence = 0;
        }
      }
      if (event.type == 'parent') {
        menu.parentId = event.newValue;
      }

      this.menuAPI.updateMenu(menu.id, menu).subscribe(() => {
        this.menuService.update();
      });
    }
  }

  selectMenuItem(event: ItemSelectEvent) {
    this.router.navigate(['admin', 'backend', 'menu', event.id]);
  }

  newMenuItem(event: ItemNewEvent) {
    const menu: Menu = {
      id: null,
      ownerId: null,
      name: event.name,
      parentId: event.parentId,
      sequence: event.sequence,
      icon: null,
      link: null,
      disabled: true,
    }

    this.menuAPI.addMenu(menu).subscribe(data => {
      const menu = data;
      this.menuAPI.getMenuList().subscribe(data => {
        this.menus = data;
        if (menu.id) {
          this.selectMenuItem({ id: menu.id });
        }
      });
      this.menuService.update();
    });
  }

  deleteMenuItem(event: ItemDeleteEvent) {
    const menu = this.menus.find(menu => menu.id == event.id);

    if (typeof menu !== 'undefined' && menu.id) {
      this.menuAPI.removeMenu(menu.id).subscribe(() => {
        this.menuAPI.getMenuList().subscribe(data => {
          this.menus = data;
          this.menuService.update();
        });
      });

      if (menu.parentId) {
        this.router.navigate(['admin', 'backend', 'menu', menu.parentId]);
      } else {
        this.router.navigate(['admin', 'backend', 'menu']);
      }
    }
  }

  updateMenuItem() {
    if (!this.formGroup.valid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    if (this.menu && this.menu.id) {
      this.menu.name = this.formGroup.value.name;
      this.menu.icon = this.formGroup.value.icon;
      this.menu.link = this.formGroup.value.link;
      this.menu.disabled = this.formGroup.value.disabled;
      this.menuAPI.updateMenu(this.menu.id, this.menu).subscribe(() => {
        this.menuAPI.getMenuList().subscribe(data => {
          this.menus = data;
          this.menuService.update();
        });
      });
    }
  }

}
