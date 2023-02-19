import { Component } from '@angular/core';
import { DrawerService } from 'src/app/core';

@Component({
  selector: 'berry-admin-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent {
  constructor(
    public drawerService: DrawerService,
  ) { }

}
