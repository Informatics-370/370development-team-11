import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/DataService/data-service'; 
import { MatSnackBar } from '@angular/material/snack-bar';
import { BackdropOptions } from 'chart.js';
import { BackupComponent } from '../backup/backup.component';

@Component({
  selector: 'app-restore',
  templateUrl: './restore.component.html',
  styleUrls: ['./restore.component.css']
})
export class RestoreComponent {
  showConfirmationDialog: boolean = true;
  showSuccessDialog: boolean = false;
  backupStatus: string;
  isLoading: boolean;

  constructor(public dialogRef: MatDialogRef<BackupComponent>, private ActRoute: ActivatedRoute, private route: Router, private dataService: DataService) { }


  onConfirm(): void {
    this.isLoading = true;
    this.backupStatus = '';
    
    this.dataService.createBackup().subscribe({
      next: (response) => {
        this.showConfirmationDialog = false;
        this.showSuccessDialog = true;
        setTimeout(() => {
          this.dialogRef.close();
          location.reload();
        }, 1750);
      }
    });
  }

  createBackup() {
    

    this.dataService.createBackup().subscribe(
      () => {
        this.backupStatus = 'Backup created successfully!';
        this.isLoading = false;
      },
      (error) => {
        this.backupStatus = 'Failed to create backup.';
        this.isLoading = false;
      }
    );
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
