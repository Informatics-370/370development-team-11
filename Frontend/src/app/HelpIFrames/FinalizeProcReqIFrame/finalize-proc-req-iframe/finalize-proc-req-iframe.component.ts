import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-finalize-proc-req-iframe',
  templateUrl: './finalize-proc-req-iframe.component.html',
  styleUrls: ['./finalize-proc-req-iframe.component.css']
})
export class FinalizeProcReqIFrameComponent {
  presetImageUrl = 'assets/Images/ViewEmployee.jpg';

  constructor(private sanitizer: DomSanitizer) {}

  getSafeUrl(): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.presetImageUrl);
  }
}
