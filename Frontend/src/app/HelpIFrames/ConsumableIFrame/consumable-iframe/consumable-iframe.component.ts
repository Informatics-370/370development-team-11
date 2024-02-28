import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-consumable-iframe',
  templateUrl: './consumable-iframe.component.html',
  styleUrls: ['./consumable-iframe.component.css']
})
export class ConsumableIFrameComponent {
  presetImageUrl = 'assets/Images/IFrameConsumable.png';

  constructor(private sanitizer: DomSanitizer) {}

  getSafeUrl(): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.presetImageUrl);
  }
}
