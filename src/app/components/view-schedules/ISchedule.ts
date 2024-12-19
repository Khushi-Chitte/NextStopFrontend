export interface Schedule {
    scheduleId: number;
    busId: number;
    busNumber: string;
    busName: string;
    operatorId: number;
    operatorName: string;
    routeId: number;
    origin: string;
    destination: string;
    departureTime: string;
    arrivalTime: string;
    fare: number;
    date: string;
  }