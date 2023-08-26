import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-place-proc-detail-iframe',
  templateUrl: './place-proc-detail-iframe.component.html',
  styleUrls: ['./place-proc-detail-iframe.component.css']
})
export class PlaceProcDetailIFrameComponent {
  presetImageUrl = 'assets/Images/IFramePlaceProcReq.png';

  constructor(private sanitizer: DomSanitizer) {}

  getSafeUrl(): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.presetImageUrl);
  }
}
