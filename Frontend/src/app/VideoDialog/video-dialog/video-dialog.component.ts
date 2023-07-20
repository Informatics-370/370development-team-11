import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/DataService/data-service';

@Component({
  selector: 'app-video-dialog',
  templateUrl: './video-dialog.component.html',
  styleUrls: ['./video-dialog.component.css']
})
export class VideoDialogComponent implements OnInit{
  Help: any

  //constructor(public dialogRef: MatDialogRef<VideoDialogComponent>, private ActRoute: ActivatedRoute, private route: Router, private dataService: DataService,
  //  @Inject(MAT_DIALOG_DATA) public data: { help_ID: number }) { }
    constructor(public dialogRef: MatDialogRef<VideoDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: { videoUrl: string }) {}

  ngOnInit(): void {
 console.log(this.data.videoUrl)
  }
}
