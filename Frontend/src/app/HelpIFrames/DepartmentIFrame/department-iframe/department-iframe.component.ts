import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-department-iframe',
  templateUrl: './department-iframe.component.html',
  styleUrls: ['./department-iframe.component.css']
})
export class DepartmentIFrameComponent {
  presetImageUrl = 'assets/Images/ViewEmployee.jpg';

  constructor(private sanitizer: DomSanitizer) {}

  getSafeUrl(): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.presetImageUrl);
  }
}
