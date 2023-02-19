import { Injectable, OnDestroy } from '@angular/core';
import { MatDrawerMode } from '@angular/material/sidenav';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Event, NavigationEnd, Router } from '@angular/router';
import { Subscription, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DrawerService implements OnDestroy {
  screenMode = 'large';
  contentMode = 'full';
  drawerMode: MatDrawerMode = 'over';
  drawerOpen = true;

  currentUrl = new BehaviorSubject<string>('');
  currentState = new BehaviorSubject<undefined>(undefined);
  watcher: Subscription;
  activeMediaQuery = '';

  constructor(
    breakpointObserver: BreakpointObserver,
    private router: Router,
  ) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.currentUrl.next(event.urlAfterRedirects);
      }
    });
    const layoutChanges = breakpointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium,
      Breakpoints.Large,
      Breakpoints.XLarge,
    ]);
    this.watcher = layoutChanges.subscribe((result: BreakpointState) => {
      for (const query of Object.keys(result.breakpoints)) {
        if (result.breakpoints[query]) {
          if (query == Breakpoints.XSmall) {
            this.screenMode = 'small';
            this.contentMode = 'full';
            this.drawerMode = 'over';
            this.drawerOpen = false;
          } else if (query == Breakpoints.Small) {
            this.screenMode = 'medium';
            this.contentMode = 'icon';
            this.drawerMode = 'side';
            this.drawerOpen = true;
          } else if ((query == Breakpoints.Medium) || (query == Breakpoints.Large) || (query == Breakpoints.XLarge)) {
            this.screenMode = 'large';
            this.contentMode = 'full';
            this.drawerMode = 'side';
            this.drawerOpen = true;
          }
        }
      }
      this.currentState.next(undefined);
    });
  }

  toggle(): void {
    if (this.screenMode == 'small') {
      this.drawerOpen = !this.drawerOpen;
      this.currentState.next(undefined);
    }
    if (this.screenMode == 'medium') {
      if (this.contentMode == 'icon') {
        this.contentMode = 'full';
        this.drawerMode = 'over';
      } else {
        this.contentMode = 'icon';
        this.drawerMode = 'side';
      }
      this.currentState.next(undefined);
    }
  }

  open() {
    if (this.screenMode == 'small') {
      this.drawerOpen = true;
    }
    if (this.screenMode == 'medium') {
      this.contentMode = 'full';
      this.drawerMode = 'over';
    }
    this.currentState.next(undefined);
  }

  close() {
    if (this.screenMode == 'small') {
      this.drawerOpen = false;
    }
    if (this.screenMode == 'medium') {
      this.drawerMode = 'side';
      this.contentMode = 'icon';
      // notify content autosize
      setTimeout(() => {
        return;
      });
    }
    this.currentState.next(undefined);
  }

  hasBackdrop(): boolean {
    return this.drawerMode != 'side';
  }

  isOpen(): boolean {
    return this.drawerOpen;
  }

  getMode(): MatDrawerMode {
    return this.drawerMode;
  }

  ngOnDestroy() {
    this.watcher.unsubscribe();
  }

}
