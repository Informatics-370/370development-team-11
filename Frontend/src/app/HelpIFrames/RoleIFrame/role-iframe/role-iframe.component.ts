import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-role-iframe',
  templateUrl: './role-iframe.component.html',
  styleUrls: ['./role-iframe.component.css']
})
export class RoleIFrameComponent {
  presetImageUrl = 'assets/Images/IFrameRole.png';

  constructor(private sanitizer: DomSanitizer) {}

  getSafeUrl(): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.presetImageUrl);
  }
}
