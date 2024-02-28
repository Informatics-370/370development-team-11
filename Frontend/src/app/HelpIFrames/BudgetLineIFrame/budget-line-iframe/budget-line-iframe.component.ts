import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-budget-line-iframe',
  templateUrl: './budget-line-iframe.component.html',
  styleUrls: ['./budget-line-iframe.component.css']
})
export class BudgetLineIFrameComponent {
  presetImageUrl = 'assets/Images/IFrameNewBudgetLine.png';

  constructor(private sanitizer: DomSanitizer) {}

  getSafeUrl(): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.presetImageUrl);
  }
}
