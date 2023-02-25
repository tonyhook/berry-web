import { Component, Inject } from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SimpleDialogData } from 'src/app/core';

@Component({
  selector: 'berry-simple-dialog',
  templateUrl: './simpledialog.component.html',
  styleUrls: ['./simpledialog.component.scss'],
})
export class SimpleDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<SimpleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SimpleDialogData,
  ) { }

  cancel(): void {
    this.dialogRef.close();
  }

}
