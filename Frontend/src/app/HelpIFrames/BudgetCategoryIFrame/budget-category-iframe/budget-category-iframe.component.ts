import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-budget-category-iframe',
  templateUrl: './budget-category-iframe.component.html',
  styleUrls: ['./budget-category-iframe.component.css']
})
export class BudgetCategoryIFrameComponent {
  presetImageUrl = 'assets/Images/IFrameBudgetCategory.png';

  constructor(private sanitizer: DomSanitizer) {}

  getSafeUrl(): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.presetImageUrl);
  }
}
