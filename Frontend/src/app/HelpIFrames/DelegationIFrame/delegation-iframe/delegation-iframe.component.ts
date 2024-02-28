import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-delegation-iframe',
  templateUrl: './delegation-iframe.component.html',
  styleUrls: ['./delegation-iframe.component.css']
})
export class DelegationIFrameComponent {
  presetImageUrl = 'assets/Images/IFrameDelegation.png';

  constructor(private sanitizer: DomSanitizer) {}

  getSafeUrl(): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.presetImageUrl);
  }
}
