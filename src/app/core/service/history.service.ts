import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class HistoryService {

  public history: string[] = [];

  constructor(
    private router: Router,
  ) { }

  replace(source: string | null, target: string) {
    if (source == null) {
      this.history.length = 0;
    } else {
      this.history.push(source);
    }

    this.router.navigateByUrl(target, { replaceUrl: true });
  }

  return(defaultSource: string) {
    let source = defaultSource;

    if (this.history.length > 0) {
      const record = this.history.pop();
      if (record) {
        source = record;
      }
    }

    this.router.navigateByUrl(source, { replaceUrl: true });
  }

}
