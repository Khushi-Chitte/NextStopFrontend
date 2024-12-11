export interface ReportData {
  route: string;
  operator: string;
  totalBookings: number;
  totalRevenue: number;
  bookingDetails: {
    bookingId: number;
    userId: number;
    scheduleId: number;
    status: string;
    bookingDate: string;
    reservedSeats: string[];
    totalFare: number;
  }[];
}