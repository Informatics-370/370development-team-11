import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-budget-allocation-iframe',
  templateUrl: './budget-allocation-iframe.component.html',
  styleUrls: ['./budget-allocation-iframe.component.css']
})
export class BudgetAllocationIFrameComponent {

  presetImageUrl = 'assets/Images/IFrameBudgetAllocation.png';

  constructor(private sanitizer: DomSanitizer) {}

  getSafeUrl(): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.presetImageUrl);
  }
}
