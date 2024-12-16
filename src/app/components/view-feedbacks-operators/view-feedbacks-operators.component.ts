import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiServiceService } from '../../services/api-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-view-feedbacks-operators',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-feedbacks-operators.component.html',
  styleUrl: './view-feedbacks-operators.component.css'
})
export class ViewFeedbacksOperatorsComponent implements OnInit {
  busId: any;
  averageRating: any;
  feedbacks: any[] = [];
  errorMessage: string = '';

  constructor(
    private apiService: ApiServiceService,
    public dialogRef: MatDialogRef<ViewFeedbacksOperatorsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.busId = data.busId; 
  }

  ngOnInit(): void {
    this.loadFeedbacks();
  }

  loadFeedbacks() {
    this.apiService.getFeedbacksByBusId(this.busId).subscribe({
      next: (feedbacks: any[]) => {
        this.feedbacks = feedbacks.map(feedback => {
          // Get booking details using the bookingId
          this.apiService.fetchUserBookingByBookingId(feedback.bookingId).subscribe({
            next: (bookingDetails: any) => {
              feedback.userID = bookingDetails.userId;
              feedback.bookingDate = bookingDetails.bookingDate;
  
              // Get user details
              this.apiService.getUserByUserId(feedback.userID).subscribe({
                next: (userDetails: any) => {
                  feedback.name = userDetails.name; 

                  this.averageRating = this.calculateAverageRating(feedbacks);

                  this.feedbacks.sort((a, b) => {
                    const dateA = new Date(a.bookingDate);
                    const dateB = new Date(b.bookingDate);
                    return dateB.getTime() - dateA.getTime(); 
                  });

                },
                error: (error: any) => {
                  console.error('Error fetching user details:', error);
                }
              });
            },
            error: (error: any) => {
              console.error('Error fetching booking details:', error);
            }
          });

          return feedback;
        });

  
        console.log('Feedbacks for bus:', this.feedbacks);        
      },
      error: (error: any) => {
        console.error('Error loading feedbacks', error);
      }
    });
  }

  calculateAverageRating(feedbacks: any[]): number {
    const totalRating = feedbacks.reduce((acc, feedback) => acc + feedback.rating, 0);
    const averageRating = totalRating / feedbacks.length;
    return parseFloat(averageRating.toFixed(2));
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

}
