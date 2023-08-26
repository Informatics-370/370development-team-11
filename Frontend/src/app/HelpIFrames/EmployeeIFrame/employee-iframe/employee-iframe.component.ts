import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-employee-iframe',
  templateUrl: './employee-iframe.component.html',
  styleUrls: ['./employee-iframe.component.css']
})
export class EmployeeIFrameComponent {

  presetImageUrl = 'assets/Images/EmployeeIFrame.png';

  constructor(private sanitizer: DomSanitizer) {}

  getSafeUrl(): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.presetImageUrl);
  }
}
