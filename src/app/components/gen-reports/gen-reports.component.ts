import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiServiceService } from '../../services/api-service.service';
import { CommonModule } from '@angular/common';
import { ReportData } from './IReport';
import * as pdfMake from 'pdfmake/build/pdfmake.js';
import * as pdfFonts from 'pdfmake/build/vfs_fonts.js';

@Component({
  selector: 'app-gen-reports',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './gen-reports.component.html',
  styleUrl: './gen-reports.component.css'
})

export class GenReportsComponent implements OnInit {
  createReportForm!: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  isSubmitting: boolean = false;
  reportsGenerated: ReportData | null = null;

  constructor(private apiService: ApiServiceService) { 
    const pdfMakeInstance = pdfMake as any;
    pdfMakeInstance.vfs = pdfFonts.vfs;

    if (!pdfMakeInstance.fonts) {
      pdfMakeInstance.fonts = {};
    }
  }

  ngOnInit(): void {
    this.createReportForm = new FormGroup({
      startDate: new FormControl('', [
        Validators.required,
        Validators.maxLength(10),
      ]),
      endDate: new FormControl('', [
        Validators.required,
        Validators.maxLength(10),
      ]),
      origin: new FormControl('', [
        Validators.required,
        Validators.maxLength(100),
      ]),
      destination: new FormControl('', [
        Validators.required,
        Validators.maxLength(100),
      ]),
      operator: new FormControl('', [
        Validators.required,
        Validators.maxLength(100),
      ]),
    });
  }

  onGenerateReports() {
    const formValues = { ...this.createReportForm.value };
    const route = `${formValues.origin}-${formValues.destination}`;
  
    const genReportData = {
      startDate: formValues.startDate,
      endDate: formValues.endDate,
      route: route,
      operator: formValues.operator
    };
  
    this.apiService.genReport(genReportData).subscribe({
      next: (response: ReportData) => {
        this.reportsGenerated = response;
        this.successMessage = 'Report generated successfully!';
        this.errorMessage = '';
      },
      error: (error: any) => {
        this.reportsGenerated = null;
        if (error.status === 404) {
          this.errorMessage = 'No report found for the data specified';
        } else {
          this.errorMessage = 'An unexpected error occurred. Please try again later.';
        }
        this.successMessage = '';
      },
    });
  }

  generatePDF() : void {
    if (!this.reportsGenerated) {
      console.error('Generated reports are not available for PDF generation.');
      return;
    }

    const docDefinition = this.getPDFDefinition(); 

    const downloadFileName : string = this.reportsGenerated.operator;

    pdfMake.createPdf(docDefinition)
      .download(`${downloadFileName}-Report.pdf`); 
  }

  getPDFDefinition(): any {
    if (!this.reportsGenerated) {
      return {};
    }
  
    const report = this.reportsGenerated;
    const bookingDetails = report.bookingDetails.map((booking) => {
      return [
        booking.bookingId,
        booking.userId,
        booking.scheduleId,
        booking.status,
        new Date(booking.bookingDate).toLocaleDateString(),
        booking.reservedSeats.join(', '),
        `₹${booking.totalFare}`,
      ];
    });
  
    const docDefinition = {
      content: [
        { text: `Report Summary:`, style: 'header' },
        {
          text: [
            { text: `Route: `, bold: true },
            `${report.route}\n\n`,
            { text: `Operator: `, bold: true },
            `${report.operator}\n\n`,
            { text: `Total Bookings: `, bold: true },
            `${report.totalBookings}\n\n`,
            { text: `Total Revenue: `, bold: true },
            `₹${report.totalRevenue}\n\n`,
          ],
          style: 'summaryText',
        },
        { text: 'Booking Details', style: 'subheader' },
        {
          style: 'tableExample',
          table: {
            widths: ['*', '*', '*', '*', '*', '*', '*'],
            body: [
              [
                'Booking ID',
                'User ID',
                'Schedule ID',
                'Status',
                'Booking Date',
                'Reserved Seats',
                'Total Fare',
              ],
              ...bookingDetails,
            ],
          },
        },
      ],
      styles: {
        header: {
          fontSize: 16,
          bold: true,
          alignment: 'center',
          margin: [0, 0, 0, 10],
        },
        summaryText: {
          fontSize: 12,
          margin: [0, 10, 0, 15],
        },
        subheader: {
          fontSize: 14,
          bold: true,
          margin: [0, 20, 0, 10],
        },
        tableExample: {
          margin: [0, 5, 0, 15],
          fontSize: 12,
        },
      },
    };
  
    return docDefinition;
  }
  
  
  

}
