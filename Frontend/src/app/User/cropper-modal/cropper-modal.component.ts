import { Component, Inject } from '@angular/core';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-cropper-modal',
  templateUrl: './cropper-modal.component.html',
  styleUrls: ['./cropper-modal.component.css']
})
export class CropperModalComponent {

  constructor(public dialogRef: MatDialogRef<CropperModalComponent>, @Inject(MAT_DIALOG_DATA) public data: { img: string }) { }
  imgChangeEvt = this.data.img;
  cropImgPreview: string = '';

  onFileChange(event: any): void {
    this.imgChangeEvt = event;
  }
  cropImg(e: ImageCroppedEvent) {
    this.cropImgPreview = e.base64;
  }
  imgLoad() {
    // display cropper tool
  }
  initCropper() {
    // init cropper
  }

  imgFailed() {
    // error msg
  }

  //onConfirm(id: number): void {
  //  this.dataService.DeleteAdmin(id).subscribe(r => {
  //    this.dataService.DeleteUser(id).subscribe({
  //      next: (response) => {
  //        this.showConfirmationDialog = false;
  //        this.showSuccessDialog = true;
  //        setTimeout(() => {
  //          this.dialogRef.close();
  //          location.reload();
  //        }, 1750);
  //      }
  //    })
  //  });
  //}





  onCancel(): void {
    this.dialogRef.close();
  }
}
