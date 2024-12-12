import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-update-user-dialog',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './update-user-dialog.component.html',
  styleUrl: './update-user-dialog.component.css'
})
export class UpdateUserDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<UpdateUserDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public userData: any
  ) { }

  onCancel(): void {
    this.dialogRef.close();  
  }

  onSave(): void {
    this.dialogRef.close(this.userData);  
  }

}
