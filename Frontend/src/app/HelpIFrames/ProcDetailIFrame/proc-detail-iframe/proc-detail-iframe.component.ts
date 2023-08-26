import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-proc-detail-iframe',
  templateUrl: './proc-detail-iframe.component.html',
  styleUrls: ['./proc-detail-iframe.component.css']
})
export class ProcDetailIFrameComponent {
  presetImageUrl = 'assets/Images/IFrameProcurementDetails.png';

  constructor(private sanitizer: DomSanitizer) {}

  getSafeUrl(): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.presetImageUrl);
  }
}
