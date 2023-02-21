import { Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Buffer } from 'buffer';

@Injectable({
  providedIn: 'root',
})
export class ContentService {

  constructor(
    private sanitizer: DomSanitizer,
  ) { }

  decodeHtmlFromBlob(content: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.decodeFromBlob(content));
  }

  decodeFromBlob(content: string): string {
    let result: string;

    if (content && content.length > 0) {
      try {
        result = Buffer.from(content, 'base64').toString('utf8');
      } catch {
        result = '';
      }
    } else {
      result = '';
    }

    return result;
  }

  encodeToBlob(content: string): string {
    return Buffer.from(content, 'utf8').toString('base64');
  }

}
