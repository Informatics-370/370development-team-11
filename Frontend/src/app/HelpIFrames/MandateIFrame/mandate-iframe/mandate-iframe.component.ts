import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-mandate-iframe',
  templateUrl: './mandate-iframe.component.html',
  styleUrls: ['./mandate-iframe.component.css']
})
export class MandateIFrameComponent {
  presetImageUrl = 'assets/Images/ViewEmployee.jpg';

  constructor(private sanitizer: DomSanitizer) {}

  getSafeUrl(): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.presetImageUrl);
  }
}
