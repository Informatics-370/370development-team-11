import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-approve-vendor-iframe',
  templateUrl: './approve-vendor-iframe.component.html',
  styleUrls: ['./approve-vendor-iframe.component.css']
})
export class ApproveVendorIFrameComponent {
  presetImageUrl = 'assets/Images/ViewEmployee.jpg';

  constructor(private sanitizer: DomSanitizer) {}

  getSafeUrl(): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.presetImageUrl);
  }
}
