import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-consumable-category-iframe',
  templateUrl: './consumable-category-iframe.component.html',
  styleUrls: ['./consumable-category-iframe.component.css']
})
export class ConsumableCategoryIFrameComponent {
  presetImageUrl = 'assets/Images/IFrameConsumableCategory.png';

  constructor(private sanitizer: DomSanitizer) {}

  getSafeUrl(): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.presetImageUrl);
  }
}
