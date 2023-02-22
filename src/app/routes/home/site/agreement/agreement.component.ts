import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';

import { ContentService, OpenVisitorAPI, Agreement } from 'src/app/core';

@Component({
  selector: 'berry-agreement',
  templateUrl: './agreement.component.html',
  styleUrls: ['./agreement.component.scss']
})
export class AgreementComponent implements OnInit {
  @Input() name = 'default';
  @Input() version = 0;
  @Output() sign: EventEmitter<Agreement> = new EventEmitter();

  agreement: Agreement | null = null;
  html: SafeHtml = '';

  constructor(
    private contentService: ContentService,
    private visitorAPI: OpenVisitorAPI,
  ) { }

  ngOnInit() {
    this.visitorAPI.getAgreement(this.name).subscribe(result => {
      this.agreement = result;
      if (this.version < this.agreement.version) {
        this.html = this.contentService.decodeHtmlFromBlob(this.agreement.text);
      }
    });
  }

  agree() {
    if (this.agreement) {
      this.sign.emit(this.agreement);
    }
  }

  disagree() {
    this.sign.emit();
  }

}
