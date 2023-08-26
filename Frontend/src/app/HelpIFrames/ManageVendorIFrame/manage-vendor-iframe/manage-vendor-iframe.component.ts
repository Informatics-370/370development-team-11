import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-manage-vendor-iframe',
  templateUrl: './manage-vendor-iframe.component.html',
  styleUrls: ['./manage-vendor-iframe.component.css']
})
export class ManageVendorIFrameComponent {
  presetImageUrl = 'assets/Images/IFrameManageVendor.png';

  constructor(private sanitizer: DomSanitizer) {}

  getSafeUrl(): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.presetImageUrl);
  }
}
