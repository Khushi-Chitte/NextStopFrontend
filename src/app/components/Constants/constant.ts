export const Constant = {
    BASE_URI : 'https://localhost:7032/api/',   //ayush uri
    // BASE_URI : 'https://localhost:7101/api/', //khushi uri
    LOGIN:'Authentication/login',
    REGISTER:'Authentication/register',
    LOGOUT: 'Authentication/logout',
    GetAllBuses: 'Bus/GetAllBuses',
    GetSeatsByBusId: 'Seat/GetSeatsByBusId/',
    SearchBuses: 'Booking/SearchBus/',
    GetUserById: 'Users/GetUserById/',
    UpdateUser: 'Users/UpdateUser/',
    GetScheduleById: 'Schedule/GetScheduleById/',
    GetBusById: 'Bus/GetBusById/',
    BookTicket: 'Booking/BookTicket',
    UpdatePayment: 'Payment/InitiatePayment',
    CancelBooking: 'Booking/CancelBooking',
    BookingsByUserId: 'Booking/ViewBookingsByUserId/',
    BookingByBookingId: 'Booking/ViewBookingByBookingId/',
    UpdatePaymentToRefund: 'Payment/InitiateRefund',
    PaymentStatus: 'Payment/GetPaymentStatus/',
    CreateRoute : 'Route/CreateRoute',
    ViewAllRoutes: 'Route/GetAllRoutes',
}

