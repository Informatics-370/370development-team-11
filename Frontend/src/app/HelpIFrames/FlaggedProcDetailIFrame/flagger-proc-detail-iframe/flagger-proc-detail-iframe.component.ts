import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-flagger-proc-detail-iframe',
  templateUrl: './flagger-proc-detail-iframe.component.html',
  styleUrls: ['./flagger-proc-detail-iframe.component.css']
})
export class FlaggerProcDetailIFrameComponent {
  presetImageUrl = 'assets/Images/IFrameFlaggedProcReq.png';

  constructor(private sanitizer: DomSanitizer) {}

  getSafeUrl(): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.presetImageUrl);
  }
}
