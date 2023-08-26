import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-branch-iframe',
  templateUrl: './branch-iframe.component.html',
  styleUrls: ['./branch-iframe.component.css']
})
export class BranchIFrameComponent {
  presetImageUrl = 'assets/Images/IFrameBranch.png';

  constructor(private sanitizer: DomSanitizer) {}

  getSafeUrl(): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.presetImageUrl);
  }
}
