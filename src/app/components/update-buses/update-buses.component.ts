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
  allAmenities: string[] = ['Blankets', 'CCTV', 'Charging Ports'];
  selectedAmenities: Set<string> = new Set();

  constructor(
    public dialogRef: MatDialogRef<UpdateBusesComponent>,
    @Inject(MAT_DIALOG_DATA) public busData: any
  ) {
    let busTypes = ['Sleeper', 'AC', 'NonAC', 'SleeperAC', 'Seater'];
    busTypes = busTypes.filter((type) => type !== busData.busType );
    busData.busTypes = busTypes;

    const amenitiesArray = (busData.amenities || '').split(',').map((item: string) => item.trim());
    this.selectedAmenities = new Set(amenitiesArray);
  }

  onCancel(): void {
    this.dialogRef.close();  
  }

  onSave(): void {
    this.busData.amenities = Array.from(this.selectedAmenities).join(', ');
    this.dialogRef.close(this.busData);  
  }

  toggleAmenity(amenity: string): void {
    if (this.selectedAmenities.has(amenity)) {
      this.selectedAmenities.delete(amenity);
    } else {
      this.selectedAmenities.add(amenity);
    }
  }

}
