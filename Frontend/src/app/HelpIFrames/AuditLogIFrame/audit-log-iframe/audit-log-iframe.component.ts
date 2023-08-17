import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-audit-log-iframe',
  templateUrl: './audit-log-iframe.component.html',
  styleUrls: ['./audit-log-iframe.component.css']
})
export class AuditLogIFrameComponent {
  presetImageUrl = 'assets/Images/ViewEmployee.jpg';

  constructor(private sanitizer: DomSanitizer) {}

  getSafeUrl(): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.presetImageUrl);
  }
}
