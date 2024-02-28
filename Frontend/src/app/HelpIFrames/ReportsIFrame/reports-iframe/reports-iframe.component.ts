import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-reports-iframe',
  templateUrl: './reports-iframe.component.html',
  styleUrls: ['./reports-iframe.component.css']
})
export class ReportsIFrameComponent {
  presetImageUrl = 'assets/Images/IFrameReports.png';

  constructor(private sanitizer: DomSanitizer) {}

  getSafeUrl(): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.presetImageUrl);
  }
}
