import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-update-buses',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './update-buses.component.html',
  styleUrl: './update-buses.component.css'
})
export class UpdateBusesComponent {
  constructor(
    public dialogRef: MatDialogRef<UpdateBusesComponent>,
    @Inject(MAT_DIALOG_DATA) public busData: any
  ) {
    let busTypes = ['Sleeper', 'AC', 'NonAC', 'SleeperAC', 'Seater'];
    busTypes = busTypes.filter((type) => type !== busData.busType );
    busData.busTypes = busTypes;

    
  }

  onCancel(): void {
    this.dialogRef.close();  
  }

  onSave(): void {
    this.dialogRef.close(this.busData);  
  }

}
