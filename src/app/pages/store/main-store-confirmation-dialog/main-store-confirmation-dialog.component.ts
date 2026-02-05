import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-main-store-confirmation-dialog',
  templateUrl: './main-store-confirmation-dialog.component.html',
  styleUrls: ['./main-store-confirmation-dialog.component.scss']
})
export class MainStoreConfirmationDialogComponent {

  constructor(public dialogRef: MatDialogRef<MainStoreConfirmationDialogComponent>) {}

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onYesClick(): void {
    this.dialogRef.close(true);
  }

}
