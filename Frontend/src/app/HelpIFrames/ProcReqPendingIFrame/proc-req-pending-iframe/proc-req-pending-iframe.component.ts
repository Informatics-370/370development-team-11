import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-proc-req-pending-iframe',
  templateUrl: './proc-req-pending-iframe.component.html',
  styleUrls: ['./proc-req-pending-iframe.component.css']
})
export class ProcReqPendingIFrameComponent {
  presetImageUrl = 'assets/Images/IFramePendingProcurement.png';

  constructor(private sanitizer: DomSanitizer) {}

  getSafeUrl(): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.presetImageUrl);
  }

}
