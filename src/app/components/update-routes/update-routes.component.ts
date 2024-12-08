import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-update-routes',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './update-routes.component.html',
  styleUrl: './update-routes.component.css'
})
export class UpdateRoutesComponent {

  constructor(
    public dialogRef: MatDialogRef<UpdateRoutesComponent>,
    @Inject(MAT_DIALOG_DATA) public routeData: any
  ) {}

  onCancel(): void {
    this.dialogRef.close();  
  }

  onSave(): void {
    this.dialogRef.close(this.routeData);  
  }

}
